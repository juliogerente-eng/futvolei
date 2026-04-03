interface RatingDeltaProps {
  delta: number;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

export default function RatingDelta({
  delta,
  size = "md",
  animate = true,
}: RatingDeltaProps) {
  const isPositive = delta > 0;
  const isZero = delta === 0;

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  if (isZero) {
    return (
      <span
        className={`font-mono font-semibold ${sizeClasses[size]}`}
        style={{ color: "var(--color-text-secondary)" }}
      >
        0
      </span>
    );
  }

  return (
    <span
      className={`font-mono font-bold ${sizeClasses[size]} ${
        animate ? "animate-fade-in" : ""
      }`}
      style={{
        color: isPositive ? "var(--color-success)" : "var(--color-error)",
      }}
    >
      {isPositive ? "+" : ""}
      {delta}
    </span>
  );
}
