import clsx from "clsx";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  ...props
}) => {
  const baseClasses = "font-medium rounded-lg transition-colors duration-200 cursor-pointer";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 active:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
    ghost: "bg-transparent text-blue-600 hover:bg-blue-50 active:bg-blue-100",
  };

  return (
    <button
      className={clsx(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
