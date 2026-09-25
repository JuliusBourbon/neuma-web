function OptionCard({ text, image, selected = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
  group
  flex w-full items-center gap-6
  rounded-2xl border-2 px-6 py-3
  text-left
  cursor-pointer
  transition-all duration-300 ease-out
  hover:-translate-y-1 hover:scale-[1.01]
  active:scale-[0.98]
  ${
    selected
      ? "border-tertiary bg-tertiary text-primary shadow-md"
      : "border-secondary bg-secondary text-primary hover:border-tertiary hover:shadow-md"
  }
`}
    >
      {image && (
        <img
          src={image}
          alt=""
          className="
            h-12 w-12 shrink-0 object-contain
            transition-transform duration-300 ease-out
            group-hover:scale-110
          "
        />
      )}

      <span className="text-lg font-medium">{text}</span>
    </button>
  );
}

export default OptionCard;
