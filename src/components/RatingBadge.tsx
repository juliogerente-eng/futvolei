import { getLevelForRating } from "@/lib/elo";

interface RatingBadgeProps {
  rating: number;
  size?: "sm" | "md" | "lg";
  showRating?: boolean;
}

export default function RatingBadge({
  rating,
  size = "md",
  showRating = true,
}: RatingBadgeProps) {
  const level = getLevelForRating(rating);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5 gap-1",
    md: "text-sm px-3 py-1 gap-1.5",
    lg: "text-base px-4 py-1.5 gap-2",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${sizeClasses[size]}`}
      style={{
        background: level.bgColor,
        color: level.color,
        border: `1px solid ${level.color}33`,
      }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ background: level.color }}
      />
      <span>{level.name}</span>
      {showRating && (
        <span style={{ opacity: 0.7 }}>{rating}</span>
      )}
    </span>
  );
}
