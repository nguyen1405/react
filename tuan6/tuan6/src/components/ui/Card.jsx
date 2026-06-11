import clsx from "clsx";

const Card = ({
  children,
  className,
  hover = false,
  padding = "md",
  ...props
}) => {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={clsx(
        "bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md dark:shadow-gray-900/30",
        hover && "transition-shadow duration-300 hover:shadow-xl dark:hover:shadow-gray-900/50",
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
