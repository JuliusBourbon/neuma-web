import { useNavigate } from "react-router-dom";

function PageHeader({ title, subtitle }) {
  const navigate = useNavigate();

  return (
    <header className="relative mx-auto flex h-28 w-full max-w-7xl shrink-0 items-center px-4 md:px-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/home")}
        aria-label="Back to home"
        className="z-10 flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-tertiary text-white shadow-sm transition hover:bg-black active:scale-95"
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
        <h1 className="whitespace-nowrap text-3xl font-normal md:text-4xl">
          {title}
        </h1>

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
