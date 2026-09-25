export default function ErrorOverlay({ message, onRetry, retryText = "Coba Lagi" }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary/95 z-40 p-6">
      <div className="text-red-700 px-8 py-6 max-w-md text-center">
        <p className="text-base font-bold mb-3">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="text-xs bg-secondary text-white px-5 py-2.5 rounded-xl font-bold hover:brightness-110 shadow transition cursor-pointer"
          >
            {retryText}
          </button>
        )}
      </div>
    </div>
  );
}
