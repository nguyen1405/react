import clsx from "clsx";

const Card = ({
  children,
  className = "",
  hover = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        "bg-white rounded-xl border border-gray-200 shadow-md",
        hover && "transition-shadow duration-300 hover:shadow-xl",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
