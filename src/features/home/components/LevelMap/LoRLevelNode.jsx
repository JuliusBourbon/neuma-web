import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getText } from "../../../../utils/text";
import LockIcon from "../../../../components/icons/lockIcon";

export default function LoRLevelNode({
    level,
    position,
    isDraggingMap = false,
    isLatestUnlocked,
    to = "/learning",
    onClick,
}) {
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const containerRef = useRef(null);

    const isLocked = level.status === "locked";
    const isCompleted = level.status === "completed";
    const isAvailable = level.status === "available" || (!isLocked && !isCompleted);
    const showPin = isLatestUnlocked !== undefined ? isLatestUnlocked : isAvailable;

    const titleText = getText(level.title) || `Level ${level.orderIndex}`;
    const descText = getText(level.description);

    const handleNodeClick = (e) => {
        e.stopPropagation();
        if (isDraggingMap) return;
        setOpenModal((prev) => !prev);
    };

    const handleStart = (e) => {
        e.stopPropagation();
        if (isLocked) return;
        if (onClick) {
            onClick();
        }
        if (to) {
            navigate(to);
        }
    };

    // Click Outside Modal to Close Modal
    useEffect(() => {
        if (!openModal) return;

        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpenModal(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [openModal]);

    return (
        <div
            ref={containerRef}
            className={`absolute transition-all ${openModal ? "z-50" : "z-10"}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                transform: "translate(-50%, -50%)",
            }}
        >
            {/* Button Level Node */}
            <button
                type="button"
                onClick={handleNodeClick}
                className="group relative z-10 flex items-center justify-center cursor-pointer select-none focus:outline-none"
                aria-label={`Level ${level.orderIndex}: ${titleText}`}
            >
                {/* Pin Latest Unlocked Level */}
                {!openModal && showPin && (
                    <div className="absolute -top-9 left-1/2 -translate-x-1/2 pointer-events-none z-30 animate-bounce">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-16 h-16 text-secondary filter drop-shadow-md"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                )}

                {/* Outer Ring */}
                <div
                    className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-105 group-active:scale-95 shadow-xl ${isAvailable
                        ? "bg-secondary p-px shadow-secondary/80"
                        : isCompleted
                            ? "bg-tertiary p-px"
                            : "bg-slate-800 p-px shadow-tertiary/70"
                        }`}
                >
                    {/* Inner Node Content */}
                    <div
                        className={`w-full h-full rounded-full flex flex-col items-center justify-center border ${isAvailable
                            ? "bg-linear-to-br from-secondary to-[#c2410c] border-amber-200 text-white"
                            : isCompleted
                                ? "bg-neon text-tertiary"
                                : "bg-tertiary text-slate-300"
                            }`}
                    >
                        {isLocked ? (
                            <span className="flex items-center justify-center filter drop-shadow">
                                <LockIcon className="w-6 h-6 text-slate-300" />
                            </span>
                        ) : isCompleted ? (
                            <div className="flex flex-col items-center leading-none">
                                <span className="text-lg font-black">{level.orderIndex}</span>
                                <span className="text-tertiary font-bold">✓</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center leading-none">
                                <span className="text-2xl font-black tracking-tight filter drop-shadow">
                                    {level.orderIndex}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Level Name Badge Below Node */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
                    <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow tracking-wide ${isAvailable
                            ? "bg-secondary text-white border border-tertiary"
                            : isCompleted
                                ? "bg-neon border text-tertiary"
                                : "bg-tertiary text-white border border-slate-300"
                            }`}
                    >
                        Level {level.orderIndex}
                    </span>
                </div>
            </button>

            {/* Modal / Popover on Click */}
            {openModal && (
                <div
                    className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 z-50 w-60 sm:w-72 bg-white rounded-2xl shadow-2xl p-4 border border-tertiary/40 text-center transition-all duration-200 animate-in fade-in zoom-in-95 cursor-default select-text"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-tertiary/15" />

                    <div className="relative z-10 flex flex-col items-center gap-1.5">
                        <div className="flex items-center gap-2">
                            {isLocked && (
                                <span className="inline-flex items-center gap-1 text-xs text-red-700 font-semibold bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                                    <LockIcon className="w-3 h-3 text-red-600" />
                                    <span>Terkunci</span>
                                </span>
                            )}
                            {isCompleted && <span className="text-xs text-tertiary bg-neon px-3 py-1 rounded-full font-bold">✓ Selesai</span>}
                        </div>

                        <h4 className="font-bold text-base text-tertiary mt-1">
                            {titleText}
                        </h4>

                        {descText && (
                            <p className="text-xs text-tertiary/80 mb-1 leading-relaxed">
                                {descText}
                            </p>
                        )}

                        {isCompleted && (
                            <div className="text-xs font-semibold text-white bg-tertiary px-3 py-1 rounded-full mb-1">
                                Skor Terbaik: {level.bestScore ?? 0}%
                            </div>
                        )}

                        {/* {isLocked && (
                            <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-xl mb-1">
                                Selesaikan level sebelumnya untuk membuka level ini.
                            </p>
                        )} */}

                        {isLocked ? (
                            <button
                                type="button"
                                disabled
                                className="mt-2 w-full py-2.5 px-4 rounded-xl bg-gray-200 text-gray-500 text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-1.5"
                            >
                                <span>Terkunci</span>
                                <LockIcon className="w-4 h-4 text-gray-400" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleStart}
                                className={`mt-2 w-full py-2.5 px-4 rounded-xl text-sm font-bold shadow-md transition active:scale-95 cursor-pointer ${isCompleted
                                    ? "bg-neon hover:bg-neon/70 text-tertiary"
                                    : "bg-secondary hover:brightness-105 text-white"
                                    }`}
                            >
                                {isCompleted ? "Ulangi" : "Mulai"}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
