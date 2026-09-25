import { useState, useRef, useEffect, useCallback } from "react";
import { MAP_DIMENSIONS, getLevelPosition } from "./levelMapConfig";
import MapLines from "./MapLines";
import LevelNode from "./levelNode";
import MapControls from "./MapControls";
import DragHandIcon from "../../../../components/icons/dragHandIcon";

export default function LevelMap({ levels = [], avatar = null, lang = 'id' }) {
    const containerRef = useRef(null);

    // State Transformasi Peta
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(0.85);

    // State Dragging
    const [isDragging, setIsDragging] = useState(false);
    const isMouseDownRef = useRef(false);
    const startCoordsRef = useRef({ x: 0, y: 0 });
    const panStartRef = useRef({ x: 0, y: 0 });
    const hasDraggedRef = useRef(false);

    // Hint: shows after 5s of no interaction, then every 10s gap
    const [showHint, setShowHint] = useState(false);
    const [hintKey, setHintKey] = useState(0);
    const hintDismissedRef = useRef(false);
    const hintInitTimerRef = useRef(null);
    const hintHideTimerRef = useRef(null);
    const hintIntervalRef = useRef(null);

    const stopHintTimers = () => {
        clearTimeout(hintInitTimerRef.current);
        clearTimeout(hintHideTimerRef.current);
        clearInterval(hintIntervalRef.current);
    };

    const dismissHintPermanently = () => {
        if (!hintDismissedRef.current) {
            hintDismissedRef.current = true;
            setShowHint(false);
            stopHintTimers();
        }
    };

    const triggerHintCycle = () => {
        if (hintDismissedRef.current) return;
        setHintKey((k) => k + 1);
        setShowHint(true);
        hintHideTimerRef.current = setTimeout(() => {
            setShowHint(false);
        }, 4000);
    };

    useEffect(() => {
        hintInitTimerRef.current = setTimeout(() => {
            if (!hintDismissedRef.current) {
                triggerHintCycle();
                hintIntervalRef.current = setInterval(() => {
                    if (!hintDismissedRef.current) triggerHintCycle();
                }, 14000);
            }
        }, 4000);

        return () => stopHintTimers();
    }, []);

    // Helper Clamping agar peta tidak keluar dari jangkauan pandangan
    const clampPan = useCallback((newX, newY, currentZoom = zoom) => {
        if (!containerRef.current) return { x: newX, y: newY };
        const viewW = containerRef.current.clientWidth || window.innerWidth;
        const viewH = containerRef.current.clientHeight || window.innerHeight;

        const mapW = MAP_DIMENSIONS.width * currentZoom;
        const mapH = MAP_DIMENSIONS.height * currentZoom;

        // Berikan batas margin 100px dari tepi
        const minX = Math.min(0, viewW - mapW + 100);
        const maxX = Math.max(0, -100);
        const minY = Math.min(0, viewH - mapH + 100);
        const maxY = Math.max(0, -100);

        return {
            x: Math.max(minX, Math.min(maxX, newX)),
            y: Math.max(minY, Math.min(maxY, newY)),
        };
    }, [zoom]);

    // Memusatkan pandangan ke level tertentu (default: level aktif pertama)
    const centerOnLevel = useCallback((targetOrderIndex = 1, customZoom = zoom) => {
        const pos = getLevelPosition(targetOrderIndex);
        const viewW = containerRef.current?.clientWidth || window.innerWidth;
        const viewH = containerRef.current?.clientHeight || window.innerHeight;

        const targetX = viewW / 2 - pos.x * customZoom;
        const targetY = viewH / 2 - pos.y * customZoom;

        const clamped = clampPan(targetX, targetY, customZoom);
        setPan(clamped);
    }, [zoom, clampPan]);

    // Auto-center ke level aktif saat pertama kali levels berhasil dimuat
    useEffect(() => {
        if (!levels || levels.length === 0) return;

        // Cari level yang aktif/available pertama, atau level 1
        const activeLevel = levels.find((l) => l.status === "available") || levels[0];
        const targetOrder = activeLevel ? activeLevel.orderIndex : 1;

        centerOnLevel(targetOrder);
    }, [levels, centerOnLevel]);

    // Mouse Events Handlers
    const handleMouseDown = (e) => {
        // Hanya tangani klik kiri
        if (e.button !== 0) return;

        isMouseDownRef.current = true;
        hasDraggedRef.current = false;
        startCoordsRef.current = { x: e.clientX, y: e.clientY };
        panStartRef.current = { ...pan };
    };

    const handleMouseMove = (e) => {
        if (!isMouseDownRef.current) return;

        const deltaX = e.clientX - startCoordsRef.current.x;
        const deltaY = e.clientY - startCoordsRef.current.y;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance > 5) {
            hasDraggedRef.current = true;
            setIsDragging(true);
            dismissHintPermanently();

            const nextX = panStartRef.current.x + deltaX;
            const nextY = panStartRef.current.y + deltaY;
            const clamped = clampPan(nextX, nextY);
            setPan(clamped);
        }
    };

    const handleMouseUp = () => {
        if (!isMouseDownRef.current) return;
        isMouseDownRef.current = false;

        // Jeda sesaat agar event onClick di node tidak terpicu jika baru selesai drag
        setTimeout(() => {
            setIsDragging(false);
            hasDraggedRef.current = false;
        }, 50);
    };

    // Touch Events Handlers untuk Mobile / Tablet
    const handleTouchStart = (e) => {
        if (e.touches.length !== 1) return;
        const touch = e.touches[0];
        isMouseDownRef.current = true;
        hasDraggedRef.current = false;
        startCoordsRef.current = { x: touch.clientX, y: touch.clientY };
        panStartRef.current = { ...pan };
    };

    const handleTouchMove = (e) => {
        if (!isMouseDownRef.current || e.touches.length !== 1) return;
        const touch = e.touches[0];

        const deltaX = touch.clientX - startCoordsRef.current.x;
        const deltaY = touch.clientY - startCoordsRef.current.y;
        const distance = Math.hypot(deltaX, deltaY);

        if (distance > 5) {
            hasDraggedRef.current = true;
            setIsDragging(true);
            dismissHintPermanently();

            const nextX = panStartRef.current.x + deltaX;
            const nextY = panStartRef.current.y + deltaY;
            const clamped = clampPan(nextX, nextY);
            setPan(clamped);
        }
    };

    const handleTouchEnd = () => {
        isMouseDownRef.current = false;
        setTimeout(() => {
            setIsDragging(false);
            hasDraggedRef.current = false;
        }, 50);
    };

    // Zoom Handlers
    const handleZoomIn = () => {
        const nextZoom = Math.min(1.4, Number((zoom + 0.15).toFixed(2)));
        setZoom(nextZoom);
        setPan((prev) => clampPan(prev.x, prev.y, nextZoom));
        dismissHintPermanently();
    };

    const handleZoomOut = () => {
        const nextZoom = Math.max(0.60, Number((zoom - 0.15).toFixed(2)));
        setZoom(nextZoom);
        setPan((prev) => clampPan(prev.x, prev.y, nextZoom));
        dismissHintPermanently();
    };

    const handleResetFocus = () => {
        const activeLevel = levels.find((l) => l.status === "available") || levels[0];
        centerOnLevel(activeLevel ? activeLevel.orderIndex : 1, 0.85);
        setZoom(0.85);
    };

    // Scroll Wheel Event Handler untuk Zoom In & Zoom Out
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e) => {
            // Mencegah scroll halaman browser bawaan
            e.preventDefault();
            dismissHintPermanently();

            // Arah zoom: deltaY < 0 = scroll up (zoom in), deltaY > 0 = scroll down (zoom out)
            const zoomDelta = e.deltaY < 0 ? 0.1 : -0.1;

            setZoom((prevZoom) => {
                const nextZoom = Math.min(1.4, Math.max(0.60, Number((prevZoom + zoomDelta).toFixed(2))));
                if (nextZoom === prevZoom) return prevZoom;

                setPan((prevPan) => {
                    const rect = container.getBoundingClientRect();
                    const cursorX = e.clientX - rect.left;
                    const cursorY = e.clientY - rect.top;

                    // Posisi koordinat peta tepat di bawah kursor mouse
                    const mapX = (cursorX - prevPan.x) / prevZoom;
                    const mapY = (cursorY - prevPan.y) / prevZoom;

                    // Posisi pan baru agar titik di bawah kursor tetap diam saat zoom
                    const nextPanX = cursorX - mapX * nextZoom;
                    const nextPanY = cursorY - mapY * nextZoom;

                    return clampPan(nextPanX, nextPanY, nextZoom);
                });

                return nextZoom;
            });
        };

        container.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            container.removeEventListener("wheel", handleWheel);
        };
    }, [clampPan]);

    return (
        <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`fade-in-delay fixed inset-0 w-screen h-screen overflow-hidden select-none bg-primary ${isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
        >
            {/* Kanvas Peta Utama yang Bergeser */}
            <div
                className="absolute origin-top-left will-change-transform"
                style={{
                    width: `${MAP_DIMENSIONS.width}px`,
                    height: `${MAP_DIMENSIONS.height}px`,
                    transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                    transition: isDragging ? "none" : "transform 0.15s ease-out",
                }}
            >
                {/* 1. Background Ilustrasi Tekstur Peta Petualangan / Topografi Nuansa Primary */}
                <div className="absolute inset-0 bg-primary pointer-events-none">
                    {/* Pola Topografi Garis Kontur Map */}

                    {/* Ornamen Lembut Nuansa Neuma */}
                    <div className="absolute top-40 left-80 w-96 h-96 rounded-full bg-orange/30 blur-3xl pointer-events-none" />
                    <div className="absolute bottom-60 right-96 w-125 h-125 rounded-full bg-neon/20 blur-3xl pointer-events-none" />
                    <div className="absolute top-1/2 w-80 h-80 rounded-full bg-yellow/40 blur-3xl pointer-events-none" />
                    <div className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full bg-yellow/40 blur-3xl pointer-events-none" />
                </div>

                {/* 2. Garis-garis Penghubung Level (MapLines) */}
                <MapLines levels={levels} />

                {/* 3. Node Level (LevelNode) */}
                {(() => {
                    const latestUnlocked = [...levels]
                        .filter((l) => l.status === "available")
                        .sort((a, b) => b.orderIndex - a.orderIndex)[0] || levels.find((l) => l.status === "available");
                    const latestUnlockedOrder = latestUnlocked?.orderIndex;

                    return levels.map((level) => {
                        const pos = getLevelPosition(level.orderIndex);
                        return (
                            <LevelNode
                                key={level.id || level.orderIndex}
                                level={level}
                                position={pos}
                                isDraggingMap={isDragging}
                                isLatestUnlocked={level.orderIndex === latestUnlockedOrder}
                                to={`/learning?levelId=${level.id}`}
                                avatar={avatar}
                                lang={lang}
                            />
                        );
                    });
                })()}
            </div>

            {/* Efek Bayangan Tepi Lembut */}
            <div className="fixed inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(38,50,0,0.06)] z-30" />

            {/* Floating Navigation Controls (Zoom in, Zoom out, Focus) */}
            <MapControls
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onResetFocus={handleResetFocus}
                currentZoom={zoom}
                lang={lang}
            />

            {/* Map Drag Hint */}
            {showHint && (
                <div
                    key={hintKey}
                    className="map-hint-container fixed bottom-30 md:bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center"
                >
                    <div className="relative flex items-center justify-start w-32 h-16">
                        <div className="map-hint-cursor absolute top-0 left-2 drop-shadow-lg">
                            <DragHandIcon size={48} stroke="var(--color-secondary)" />
                        </div>
                    </div>

                    <div className="text-secondary font-semibold py-2 text-center">
                        {lang === 'id' ? "Tahan klik & geser untuk menjelajahi peta" : "Click & drag to explore the map"}
                    </div>
                </div>
            )}
        </div>
    );
}
