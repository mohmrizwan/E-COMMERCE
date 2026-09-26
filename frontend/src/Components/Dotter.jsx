const Dotter = ({ className = "", dotClassName = "bg-indigo-600" }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span
        className={`size-3 animate-pulse rounded-full ${dotClassName}`}
        aria-hidden="true"
      />
      <span
        className={`size-3 animate-pulse rounded-full ${dotClassName} [animation-delay:0.2s]`}
        aria-hidden="true"
      />
      <span
        className={`size-3 animate-pulse rounded-full ${dotClassName} [animation-delay:0.4s]`}
        aria-hidden="true"
      />
    </span>
  );
};

export default Dotter;
