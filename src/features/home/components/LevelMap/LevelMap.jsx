import { MAP_DIMENSIONS, getLevelPosition } from "./levelMapConfig";
import MapLines from "./MapLines";
import LevelNode from "./levelNode";
import MapControls from "./MapControls";
import DragHandIcon from "../../../../components/icons/dragHandIcon";
import { useMapNavigation } from "../../hooks/useMapNavigation";
import { useMapHint } from "../../hooks/useMapHint";

export default function LevelMap({ levels = [], avatar = null, lang = 'id' }) {
    const { showHint, hintKey, dismissHint } = useMapHint();
    const {
        containerRef,
        pan,
        zoom,
        isDragging,
        handlers,
        controls
    } = useMapNavigation(levels, dismissHint);

    return (
        <div
            ref={containerRef}
            {...handlers}
            className={`fade-in-delay fixed inset-0 w-screen h-screen overflow-hidden select-none bg-primary ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
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
                onZoomIn={controls.onZoomIn}
                onZoomOut={controls.onZoomOut}
                onResetFocus={controls.onResetFocus}
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
