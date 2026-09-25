import dropdownArrow from "../../../assets/profile/dropdown.png";

function ProfileField({
  label,
  value,
  type = "text",
  editing = false,
  disabled = false,
  onChange,
  options = [],
}) {
  const fieldClasses = `
  box-border
  h-12
  w-full
  rounded-md
  border
  bg-white/50
  px-4
  py-3
  text-base
  leading-normal
  text-tertiary
  font-medium
  outline-none
  transition
  duration-200
  disabled:cursor-default
  disabled:opacity-100
`;

  const modeClasses = editing
    ? `
    ${disabled ? "!bg-white/50" : "!bg-white !border-secondary/50"}
    border-white
    ${!disabled
      ? "hover:border-secondary focus:border-secondary focus:ring-2 focus:ring-secondary/25"
      : ""
    }
  `
    : `
    border-white
  `;
  return (
    <div>
      {/* Label */}
      <label className="mb-2 block text-xl">{label}</label>

      {/* Dropdown ketika mode edit */}
      {editing && type === "select" ? (
        <div className="relative w-full">
          <select
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`${fieldClasses} ${modeClasses} cursor-pointer appearance-none pr-10`}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Custom Dropdown Icon */}
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
            <img
              src={dropdownArrow}
              alt="Dropdown"
              className="h-6 w-6 object-contain"
            />
          </div>
        </div>
      ) : (
        /* Input ketika mode read atau edit */
        <input
          type={type}
          value={value}
          disabled={!editing || disabled}
          onChange={onChange}
          className={`${fieldClasses} ${modeClasses}`}
        />
      )}
    </div>
  );
}

export default ProfileField;
