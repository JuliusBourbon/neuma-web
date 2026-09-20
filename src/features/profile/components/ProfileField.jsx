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
  const fieldClasses =
    "w-full h-12 rounded-md bg-[#E5FE96] px-4 py-3 text-[#263200] text-base leading-normal outline-none box-border";

  return (
    <div>
      {/* Label */}
      <label className="block text-xl mb-2">{label}</label>

      {/* Dropdown ketika mode edit */}
      {editing && type === "select" ? (
        <div className="relative w-full">
          <select
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`${fieldClasses} appearance-none pr-10 cursor-pointer`}
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
              className="w-6 h-6 object-contain"
            />
          </div>
        </div>
      ) : (
        //  Input ketika mode read atau edit
        <input
          type={type}
          value={value}
          disabled={!editing || disabled}
          onChange={onChange}
          className={fieldClasses}
        />
      )}
    </div>
  );
}

export default ProfileField;
