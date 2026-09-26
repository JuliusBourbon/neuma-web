export default function LoadingOverlay({ message }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-primary z-40">
      <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
      {message && (
        <p className="text-tertiary/80 font-medium text-sm tracking-wide">
          {message}
        </p>
      )}
    </div>
  );
}
