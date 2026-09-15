import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LockIcon from "../icons/lockIcon";

export default function LevelButton({
    title,
    text,
    description,
    status = "available", // 'available' | 'locked' | 'completed'
    bestScore = 0,
    classes = "",
    modalClasses = "",
    onClick,
    to = "/learning",
    children,
}) {
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const containerRef = useRef(null);

    const isLocked = status === "locked";
    const isCompleted = status === "completed";

    const toggleModal = () => {
        setOpenModal((prev) => !prev);
    };

    const handleStart = () => {
        if (isLocked) return;
        if (onClick) {
            onClick();
        }
        if (to) {
            navigate(to);
        }
    };

    // Close modal when clicking outside
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

    // Button style based on status
    let buttonColor = "bg-secondary text-white shadow-md hover:brightness-105";
    if (isLocked) {
        buttonColor = "bg-gray-400 text-gray-200 shadow-sm opacity-80 cursor-pointer";
    } else if (isCompleted) {
        buttonColor = "bg-emerald-600 text-white shadow-md hover:brightness-105";
    }

    return (
        <div ref={containerRef} className="relative inline-flex flex-col items-center">
            {/* Modal / Popover di atas button */}
            {openModal && (
                <div
                    className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-10 w-56 sm:w-64 bg-white rounded-2xl shadow-xl p-4 border border-tertiary/10 text-center transition-all duration-200 animate-in fade-in zoom-in-95 ${modalClasses}`}
                >
                    {/* Panah kecil ke bawah (speech bubble pointer) */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-tertiary/10" />

                    {/* Konten Modal */}
                    <div className="relative z-10 flex flex-col items-center gap-1.5">
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-lg text-tertiary">
                                {title || `Level ${text ?? ""}`}
                            </h4>
                            {isLocked && <span title="Terkunci" className="text-sm text-red-500 inline-flex items-center"><LockIcon className="w-4 h-4 text-red-500" /></span>}
                            {isCompleted && <span title="Selesai" className="text-sm">✓</span>}
                        </div>

                        {description && (
                            <p className="text-xs text-tertiary/70 mb-1">{description}</p>
                        )}

                        {isCompleted && (
                            <div className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mb-1">
                                Skor Terbaik: {bestScore}%
                            </div>
                        )}

                        {isLocked && (
                            <p className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-lg mb-1">
                                Selesaikan level sebelumnya untuk membuka level ini.
                            </p>
                        )}

                        {children ? (
                            children
                        ) : isLocked ? (
                            <button
                                type="button"
                                disabled
                                className="mt-2 w-full py-2 px-4 rounded-xl bg-gray-200 text-gray-400 text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-1.5"
                            >
                                <span>Terkunci</span>
                                <LockIcon className="w-4 h-4 text-gray-400" />
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleStart}
                                className={`mt-2 w-full py-2 px-4 rounded-xl text-white text-sm font-semibold transition shadow-sm cursor-pointer ${isCompleted
                                    ? "bg-emerald-600 hover:brightness-105 active:scale-95"
                                    : "bg-secondary hover:brightness-105 active:scale-95"
                                    }`}
                            >
                                {isCompleted ? "Buka Ulang" : "Mulai"}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Level circular button */}
            <button
                type="button"
                onClick={toggleModal}
                className={`relative text-center rounded-full font-bold text-xl p-4 h-16 w-16 flex items-center justify-center active:scale-95 transition cursor-pointer ${buttonColor} ${classes}`}
            >
                {isLocked ? (
                    <span className="flex items-center justify-center"><LockIcon className="w-6 h-6 text-white" /></span>
                ) : isCompleted ? (
                    <div className="flex flex-col items-center">
                        <span>{text}</span>
                        <span className="text-[10px] -mt-1 font-normal">✓</span>
                    </div>
                ) : (
                    <span>{text}</span>
                )}
            </button>
        </div>
    );
}