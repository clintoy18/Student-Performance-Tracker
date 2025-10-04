import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

interface InputFieldProps {
  id: string;
  type?: "text" | "password" | "email" | "number";
  label: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean; // ✅ renamed to match input attribute
  required?: boolean
}

const TextInputField: React.FC<InputFieldProps> = ({
  id,
  type = "text",
  label,
  value,
  placeholder,
  onChange,
  disabled = false, // ✅ default false
  required = false
}) => {
  const [isVisible, setIsVisible] = useState(false);

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

        {/* Input field */}
        <input
          className="w-full text-sm py-2 px-4 bg-transparent border border-gray-300 rounded-md 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans disabled:bg-gray-100 disabled:cursor-not-allowed"
          id={id}
          type={isVisible && type === "password" ? "text" : type}
          name={id}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          required={required}
        />
      </div>
    </div>
  );
};

export default TextInputField;
