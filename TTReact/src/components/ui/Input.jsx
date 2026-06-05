import clsx from "clsx";

const Input = ({
  label,
  error,
  helperText,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        className={clsx(
          "w-full px-3 py-2 border rounded-lg text-sm",
          "focus:outline-none focus:ring-2 focus:ring-blue-500",
          "transition-colors duration-200",
          error
            ? "border-red-500 focus:ring-red-500 bg-red-50"
            : "border-gray-300 bg-white hover:border-gray-400",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
