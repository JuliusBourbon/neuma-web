import LockIcon from "../../../../components/icons/lockIcon";

export default function LevelNodePopover({
    level,
    lang,
    isLocked,
    isCompleted,
    titleText,
    descText,
    onStart,
}) {
    return (
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
                            <span>{lang === 'id' ? "Terkunci" : "Locked"}</span>
                        </span>
                    )}
                    {isCompleted && (
                        <span className="text-xs text-tertiary bg-neon px-3 py-1 rounded-full font-bold">
                            ✓ {lang === 'id' ? "Selesai" : "Completed"}
                        </span>
                    )}
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
                        {lang === 'id' ? "Skor Terbaik: " : "Best Score: "}{level.bestScore ?? 0}%
                    </div>
                )}

                {isLocked ? (
                    <button
                        type="button"
                        disabled
                        className="mt-2 w-full py-2.5 px-4 rounded-xl bg-gray-200 text-gray-500 text-sm font-semibold cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                        <span>{lang === 'id' ? "Terkunci" : "Locked"}</span>
                        <LockIcon className="w-4 h-4 text-gray-400" />
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onStart}
                        className={`mt-2 w-full py-2.5 px-4 rounded-xl text-sm font-bold shadow-md transition active:scale-95 cursor-pointer ${
                            isCompleted
                                ? "bg-neon hover:bg-neon/70 text-tertiary"
                                : "bg-secondary hover:brightness-105 text-white"
                        }`}
                    >
                        {isCompleted ? (lang === 'id' ? "Ulangi" : "Retry") : (lang === 'id' ? "Mulai" : "Start")}
                    </button>
                )}
            </div>
        </div>
    );
}
