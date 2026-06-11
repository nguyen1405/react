import clsx from "clsx";

const Button = ({
  variant = "primary",
  size = "md",
  disabled = false,
  children,
  className,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3 text-base",
  };

  const variantClasses = {
    primary:
      "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-md hover:shadow-lg",
    secondary:
      "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-400 border border-gray-200 dark:border-gray-600",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg",
    ghost:
      "bg-transparent text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 focus:ring-primary-500",
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
