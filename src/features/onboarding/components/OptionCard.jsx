function OptionCard({ text, image, selected = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full rounded-2xl border-2 px-6 py-3
        flex items-center gap-6
        text-left transition duration-200
        cursor-pointer
        ${
          selected
            ? "border-tertiary bg-tertiary text-primary"
            : "border-secondary bg-secondary text-primary hover:border-tertiary"
        }
      `}
    >
      {image && (
        <img src={image} alt="" className="w-12 h-12 object-contain shrink-0" />
      )}

      <span className="text-lg font-medium">{text}</span>
    </button>
  );
}

export default OptionCard;
