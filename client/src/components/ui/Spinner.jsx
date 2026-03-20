const Spinner = ({ size = "md" }) => {
  const s = size === "sm" ? "w-4 h-4" : "w-6 h-6";
  return (
    <div
      className={`${s} rounded-full border-2 border-white/10 border-t-brand-500 animate-spin-slow`}
    />
  );
};

export default Spinner;