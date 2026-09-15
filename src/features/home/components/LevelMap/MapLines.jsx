import { MAP_DIMENSIONS, LEVEL_CONNECTIONS, getLevelPosition } from "./levelMapConfig";

export default function MapLines({ levels = [] }) {
    const levelStatusMap = new Map();
    levels.forEach((lvl) => {
        levelStatusMap.set(lvl.orderIndex, lvl.status);
    });

    return (
        <svg
            className="absolute inset-0 pointer-events-none z-0"
            width={MAP_DIMENSIONS.width}
            height={MAP_DIMENSIONS.height}
            viewBox={`0 0 ${MAP_DIMENSIONS.width} ${MAP_DIMENSIONS.height}`}
        >
            <defs>
                {/* Glow Filter for Active Line */}
                <filter id="unlocked-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Linear Gradient for Active Line */}
                <linearGradient id="activeLineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FE7236" />
                    <stop offset="50%" stopColor="#FFAA47" />
                    <stop offset="100%" stopColor="#FE7236" />
                </linearGradient>

                <linearGradient id="cyanGlowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#818cf8" />
                </linearGradient>
            </defs>

            {LEVEL_CONNECTIONS.map((conn, idx) => {
                const p1 = getLevelPosition(conn.from);
                const p2 = getLevelPosition(conn.to);

                const statusFrom = levelStatusMap.get(conn.from) || "available";
                const statusTo = levelStatusMap.get(conn.to) || "locked";

                // Connection is unlocked if the target node is 'available' or 'completed'
                const isPathUnlocked =
                    (statusFrom === "completed" || statusFrom === "available") &&
                    (statusTo === "available" || statusTo === "completed");

                // Diamond waypoint
                const midX = (p1.x + p2.x) / 2;
                const midY = (p1.y + p2.y) / 2;

                if (isPathUnlocked) {
                    return (
                        <g key={`line-${conn.from}-${conn.to}-${idx}`}>
                            {/* Outer Glow */}
                            <line
                                x1={p1.x}
                                y1={p1.y}
                                x2={p2.x}
                                y2={p2.y}
                                stroke="#FE7236"
                                strokeWidth="8"
                                strokeOpacity="0.35"
                                strokeLinecap="round"
                                filter="url(#unlocked-glow)"
                            />
                            {/* Core Solid Line */}
                            <line
                                x1={p1.x}
                                y1={p1.y}
                                x2={p2.x}
                                y2={p2.y}
                                stroke="url(#activeLineGradient)"
                                strokeWidth="4"
                                strokeLinecap="round"
                            />
                            {/* LoR Gold Diamond Waypoint Ornament in the middle of the line */}
                            <polygon
                                points={`${midX},${midY - 6} ${midX + 6},${midY} ${midX},${midY + 6} ${midX - 6},${midY}`}
                                fill="#FE7236"
                                stroke="#ffffff"
                                strokeWidth="1.5"
                            />
                        </g>
                    );
                }

                // Dashed Line for Locked Level
                return (
                    <g key={`line-${conn.from}-${conn.to}-${idx}`}>
                        <line
                            x1={p1.x}
                            y1={p1.y}
                            x2={p2.x}
                            y2={p2.y}
                            stroke="#263200"
                            strokeOpacity={conn.isSecondary ? "0.2" : "0.4"}
                            strokeWidth={conn.isSecondary ? "2" : "2.5"}
                            strokeDasharray="8 8"
                            strokeLinecap="round"
                        />
                        {/* Subtle waypoint on the locked path */}
                        {!conn.isSecondary && (
                            <circle
                                cx={midX}
                                cy={midY}
                                r="3"
                                fill="#263200"
                                fillOpacity="0.4"
                            />
                        )}
                    </g>
                );
            })}
        </svg>
    );
}
