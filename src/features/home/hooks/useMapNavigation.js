import { useState, useRef, useCallback, useEffect } from "react";
import { MAP_DIMENSIONS, getLevelPosition } from "../components/LevelMap/levelMapConfig";

export function useMapNavigation(levels, dismissHint) {
    const containerRef = useRef(null);

    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(0.85);

    const [isDragging, setIsDragging] = useState(false);
    const isMouseDownRef = useRef(false);
    const startCoordsRef = useRef({ x: 0, y: 0 });
    const panStartRef = useRef({ x: 0, y: 0 });
    const hasDraggedRef = useRef(false);

    const clampPan = useCallback((newX, newY, currentZoom = zoom) => {
        if (!containerRef.current) return { x: newX, y: newY };
        const viewW = containerRef.current.clientWidth || window.innerWidth;
        const viewH = containerRef.current.clientHeight || window.innerHeight;

        const mapW = MAP_DIMENSIONS.width * currentZoom;
        const mapH = MAP_DIMENSIONS.height * currentZoom;

        const minX = Math.min(0, viewW - mapW + 100);
        const maxX = Math.max(0, -100);
        const minY = Math.min(0, viewH - mapH + 100);
        const maxY = Math.max(0, -100);

        return {
            x: Math.max(minX, Math.min(maxX, newX)),
            y: Math.max(minY, Math.min(maxY, newY)),
        };
    }, [zoom]);

    const centerOnLevel = useCallback((targetOrderIndex = 1, customZoom = zoom) => {
        const pos = getLevelPosition(targetOrderIndex);
        const viewW = containerRef.current?.clientWidth || window.innerWidth;
        const viewH = containerRef.current?.clientHeight || window.innerHeight;

        const targetX = viewW / 2 - pos.x * customZoom;
        const targetY = viewH / 2 - pos.y * customZoom;

        const clamped = clampPan(targetX, targetY, customZoom);
        setPan(clamped);
    }, [zoom, clampPan]);

    useEffect(() => {
        if (!levels || levels.length === 0) return;
        const activeLevel = levels.find((l) => l.status === "available") || levels[0];
        const targetOrder = activeLevel ? activeLevel.orderIndex : 1;
        centerOnLevel(targetOrder);
    }, [levels, centerOnLevel]);

    const handleMouseDown = (e) => {
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
            if (dismissHint) dismissHint();

            const nextX = panStartRef.current.x + deltaX;
            const nextY = panStartRef.current.y + deltaY;
            setPan(clampPan(nextX, nextY));
        }
    };

    const handleMouseUp = () => {
        if (!isMouseDownRef.current) return;
        isMouseDownRef.current = false;
        setTimeout(() => {
            setIsDragging(false);
            hasDraggedRef.current = false;
        }, 50);
    };

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
            if (dismissHint) dismissHint();

            const nextX = panStartRef.current.x + deltaX;
            const nextY = panStartRef.current.y + deltaY;
            setPan(clampPan(nextX, nextY));
        }
    };

    const handleTouchEnd = () => {
        isMouseDownRef.current = false;
        setTimeout(() => {
            setIsDragging(false);
            hasDraggedRef.current = false;
        }, 50);
    };

    const handleZoomIn = () => {
        const nextZoom = Math.min(1.4, Number((zoom + 0.15).toFixed(2)));
        setZoom(nextZoom);
        setPan((prev) => clampPan(prev.x, prev.y, nextZoom));
        if (dismissHint) dismissHint();
    };

    const handleZoomOut = () => {
        const nextZoom = Math.max(0.60, Number((zoom - 0.15).toFixed(2)));
        setZoom(nextZoom);
        setPan((prev) => clampPan(prev.x, prev.y, nextZoom));
        if (dismissHint) dismissHint();
    };

    const handleResetFocus = () => {
        const activeLevel = levels.find((l) => l.status === "available") || levels[0];
        centerOnLevel(activeLevel ? activeLevel.orderIndex : 1, 0.85);
        setZoom(0.85);
    };

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e) => {
            e.preventDefault();
            if (dismissHint) dismissHint();

            const zoomDelta = e.deltaY < 0 ? 0.1 : -0.1;

            setZoom((prevZoom) => {
                const nextZoom = Math.min(1.4, Math.max(0.60, Number((prevZoom + zoomDelta).toFixed(2))));
                if (nextZoom === prevZoom) return prevZoom;

                setPan((prevPan) => {
                    const rect = container.getBoundingClientRect();
                    const cursorX = e.clientX - rect.left;
                    const cursorY = e.clientY - rect.top;

                    const mapX = (cursorX - prevPan.x) / prevZoom;
                    const mapY = (cursorY - prevPan.y) / prevZoom;

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
    }, [clampPan, dismissHint]);

    return {
        containerRef,
        pan,
        zoom,
        isDragging,
        handlers: {
            onMouseDown: handleMouseDown,
            onMouseMove: handleMouseMove,
            onMouseUp: handleMouseUp,
            onMouseLeave: handleMouseUp,
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
        },
        controls: {
            onZoomIn: handleZoomIn,
            onZoomOut: handleZoomOut,
            onResetFocus: handleResetFocus,
        }
    };
}
