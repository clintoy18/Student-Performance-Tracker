import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";

interface InputFieldProps {
  id: string;
  type?: 'text' | 'password' | 'email' | 'number';
  label: string;
  value: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextInputField: React.FC<InputFieldProps> = ({
  id,
  type = 'text',
  label,
  value,
  placeholder,
  onChange
}) => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const handleToggle = () => {
        setIsVisible(prevState => !prevState);
    }

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-gray-700 capitalize font-heading"
      >
        {label}
      </label>

      <div className="relative mt-2">
        {type === 'password' && (
          <button
            onClick={handleToggle}
            type="button" 
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isVisible ? <Eye /> : <EyeOff />}
          </button>
        )}

        {/* Input field */}
        <input
          className="w-full font-sm py-2 px-4 bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans"
          id={id}
          type={isVisible ? 'text' : type}
          name={id}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default TextInputField;
