import { useNavigate } from "react-router-dom";

function PageHeader({ title, subtitle }) {
  const navigate = useNavigate();

  return (
    <header className="relative mx-auto flex h-16 md:h-24 w-full max-w-7xl shrink-0 items-center px-4 md:px-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/home")}
        aria-label="Back to home"
        className="z-10 flex h-8 w-8 md:h-12 md:w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-tertiary text-white shadow-sm transition hover:bg-black active:scale-95"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Title */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
        <span className="whitespace-nowrap text-2xl font-normal md:text-4xl">
          {title}
        </span>

        {subtitle && (
          <p className="mt-1 whitespace-nowrap text-base text-secondary md:text-xl">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}

export default PageHeader;
