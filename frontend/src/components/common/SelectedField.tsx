const SelectField = ({
  id,
  label,
  value,
  onChange,
  options,
  error,
  required,
  icon: IconComponent, // optional icon like TextInputField
}) => {
  const borderColor = error ? "border-red-500" : "border-gray-300";
  const focusRingColor = error ? "focus:ring-red-500" : "focus:ring-blue-500";

  return (
    <div className="mb-4 flex-1">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-gray-700 capitalize font-heading"
      >
        {label}
      </label>

      <div className="relative mt-2">
        {/* Left icon (optional) */}
        {IconComponent && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            {IconComponent}
          </div>
        )}

        <select
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full text-sm py-2 px-4 bg-transparent text-gray-500 border rounded-md
            focus:outline-none focus:ring-2 ${focusRingColor} font-sans
            disabled:bg-gray-100 disabled:cursor-not-allowed ${borderColor}
            ${IconComponent ? "pl-10" : ""} pr-10 appearance-none`}
        >
          <option value="">Select {label}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Right dropdown chevron */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
          ▼
        </div>

        {/* Error */}
        {error && (
          <p className="mt-1 text-xs text-red-600 font-sans">{error}</p>
        )}
      </div>
    </div>
  );
};

export default SelectField;
