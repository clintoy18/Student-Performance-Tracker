import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

interface InputFieldProps {
  id: string;
  type?: "text" | "password" | "email" | "number";
  label: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode; // ✅ Accept icon component
}

const TextInputField: React.FC<InputFieldProps> = ({
  id,
  type = "text",
  label,
  value,
  placeholder,
  onChange,
  disabled = false,
  required = false,
  error,
  icon: IconComponent,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const borderColor = error ? "border-red-500" : "border-gray-300";
  const focusRingColor = error ? "focus:ring-red-500" : "focus:ring-blue-500";

  const handleToggle = () => {
    setIsVisible((prevState) => !prevState);
  };

  return (
    <div className="mb-4 flex-1">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-gray-700 capitalize font-heading"
      >
        {label}
      </label>

      <div className="relative mt-2">
        {/* Left Icon (if provided) */}
        {IconComponent && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
            {IconComponent}
          </div>
        )}
        {/* Input field */}
        <input
          className={`w-full text-sm py-2 px-4 bg-transparent border rounded-md 
            focus:outline-none focus:ring-2 ${focusRingColor} font-sans 
            disabled:bg-gray-100 disabled:cursor-not-allowed ${borderColor}
            ${IconComponent ? "pl-10" : ""} ${type === "password" ? "pr-10" : ""}`}
          id={id}
          type={isVisible && type === "password" ? "text" : type}
          name={id}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          required={required}
        />

        {/* Password visibility toggle (right side) */}
        {type === "password" && (
          <button
            onClick={handleToggle}
            type="button"
            aria-label={isVisible ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isVisible ? <Eye /> : <EyeOff />}
          </button>
        )}

        {/* Error message */}
        {error && (
          <p id={`${id}-error`} className="mt-1 text-xs text-red-600 font-sans">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default TextInputField;