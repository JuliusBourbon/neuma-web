export default function MapControls({ onZoomIn, onZoomOut, onResetFocus, currentZoom = 1 }) {
    return (
        <aside
            aria-label="Map navigation controls"
            className="fixed right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3 pointer-events-auto select-none"
        >
            <div className="bg-tertiary/80 backdrop-blur-md border border-white/20 p-1.5 rounded-2xl shadow-2xl flex flex-col gap-1.5">
                {/* Zoom In */}
                <button
                    type="button"
                    onClick={onZoomIn}
                    title="Perbesar Peta (+)"
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-xl transition active:scale-90 cursor-pointer"
                >
                    +
                </button>

                {/* Zoom Level */}
                <div className="text-[10px] font-bold text-center text-white/60 py-0.5">
                    {Math.round(currentZoom * 100)}%
                </div>

                {/* Zoom Out */}
                <button
                    type="button"
                    onClick={onZoomOut}
                    title="Perkecil Peta (-)"
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-xl transition active:scale-90 cursor-pointer"
                >
                    −
                </button>
            </div>

            {/* Reset Button */}
            <button
                type="button"
                onClick={onResetFocus}
                title="Pusatkan ke Level Aktif"
                className="w-12 h-12 rounded-2xl bg-secondary hover:brightness-110 text-white shadow-xl flex items-center justify-center transition active:scale-90 border-2 border-amber-200/50 cursor-pointer group"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 transition-transform group-hover:rotate-45"
                >
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
            </button>
        </aside>
    );
}
