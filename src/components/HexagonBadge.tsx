import { cn } from "@/lib/utils";

interface HexagonBadgeProps {
  score: number;
  maxScore?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const HexagonBadge = ({ 
  score, 
  maxScore = 10, 
  size = "md",
  className 
}: HexagonBadgeProps) => {
  const percentage = (score / maxScore) * 100;
  
  const getColor = () => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-primary";
    if (percentage >= 40) return "bg-orange-500";
    return "bg-destructive";
  };

  const sizeClasses = {
    sm: "w-12 h-14 text-sm",
    md: "w-16 h-[72px] text-xl",
    lg: "w-20 h-[88px] text-2xl",
  };

  return (
    <div className={cn("hexagon relative", getColor(), sizeClasses[size], className)}>
      <span className="font-display font-bold">{score}</span>
      <span className="absolute bottom-1 text-[8px] opacity-70">/{maxScore}</span>
    </div>
  );
};
