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
        "bg-white rounded-2xl border border-gray-200 shadow-md",
        hover && "transition-shadow duration-300 hover:shadow-xl",
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
