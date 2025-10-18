import React from "react";

// Define allowed variants
type ButtonVariant = "primary" | "outline" | "ghost" | "danger";

interface ButtonProps {
  onClick?: () => void;
  label: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  variant?: ButtonVariant; // ✅ Add variant prop
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  label,
  type = "button",
  className = "",
  disabled = false,
  icon,
  iconPosition = "left",
  variant = "primary", // default variant
}) => {
  // Base classes
  const baseClasses =
    "inline-flex items-center justify-center gap-2 px-3 py-1 rounded-sm font-sans text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed";

  // Variant-specific classes
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    outline:
      "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const appliedVariantClass = variantClasses[variant];

  return (
    <button
      className={`${baseClasses} ${appliedVariantClass} ${className}`}
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