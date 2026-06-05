import clsx from "clsx";

const Badge = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
  };

  const variantClasses = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
    error: "bg-red-100 text-red-700",
    warning: "bg-yellow-100 text-yellow-700",
    info: "bg-blue-100 text-blue-700",
    popular: "bg-gradient-to-r from-orange-400 to-pink-500 text-white",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center font-medium rounded-full",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
