import defaultMascot from "../../assets/onboarding/firefly-main.png";

/**
 * Reusable DialogBubble component (Image / Mascot + Speech Bubble).
 *
 * @param {string} image - URL or imported asset of the mascot/character (defaults to firefly mascot).
 * @param {string} imageAlt - Alt text for the image.
 * @param {string} text - The dialog text.
 * @param {React.ReactNode} children - Optional custom JSX content inside the bubble.
 * @param {'left' | 'right'} position - Position of the image relative to the speech bubble ('left' or 'right').
 * @param {string} className - Additional CSS classes for the outer wrapper.
 * @param {string} imageClassName - Custom CSS classes for the image.
 * @param {string} bubbleClassName - Custom CSS classes for the speech bubble container.
 * @param {string} textClassName - Custom CSS classes for the text.
 */

export default function DialogBubble({
  image = defaultMascot,
  imageAlt = "Neuma mascot",
  text,
  children,
  position = "left",
  className = "",
  classes = "",
  imageClassName = "",
  imageClasses = "",
  bubbleClassName = "",
  bubbleClasses = "",
  textClassName = "",
  textClasses = "",
}) {
  const customWrapper = className || classes;
  const customImage = imageClassName || imageClasses;
  const customBubble = bubbleClassName || bubbleClasses;
  const customText = textClassName || textClasses;

  const isRight = position === "right";

  return (
    <div
      className={`flex items-center justify-center gap-3 md:gap-8 ${isRight ? "flex-row-reverse" : ""
        } ${customWrapper || "mb-10"}`.trim()}
    >
      {/* Mascot / Avatar Image */}
      {image && (
        <img
          src={image}
          alt={imageAlt}
          className={customImage || "h-20 w-20 md:h-28 md:w-28 object-contain shrink-0"}
        />
      )}

      {/* Speech Bubble Container */}
      <div
        className={`relative ${customBubble ||
          "rounded-xl border-2 border-tertiary bg-primary px-4 md:px-8 py-3 md:py-5"
          }`}
      >
        {/* Speech Bubble Pointer / Tail */}
        {isRight ? (
          <div className="absolute -right-3 top-1/2 h-5 w-5 -translate-y-1/2 rotate-45 border-r-2 border-t-2 border-tertiary bg-primary" />
        ) : (
          <div className="absolute -left-3 top-1/2 h-5 w-5 -translate-y-1/2 rotate-45 border-b-2 border-l-2 border-tertiary bg-primary" />
        )}

        {/* Dialog Content */}
        {text && (
          <p className={customText || "relative text-sm md:text-2xl text-tertiary text-justify"}>
            {text}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
