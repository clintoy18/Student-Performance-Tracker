import React from "react";

interface ButtonProps {
  onClick?: () => void;
  label: string;
  type?: "button" | "submit" | "reset";
  className?: string; // Allow custom class names for flexibility
  disabled?: boolean;
  icon?: React.ReactNode; // Accept an icon component
  iconPosition?: "left" | "right"; // Control icon placement
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  label,
  type = "button",
  className = "",
  disabled = false,
  icon,
  iconPosition = "left",
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-3 py-1 rounded-sm font-sans text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      {icon && iconPosition === "left" && <span>{icon}</span>}
      <span>{label}</span>
      {icon && iconPosition === "right" && <span>{icon}</span>}
    </button>
  );
};

export default Button;
