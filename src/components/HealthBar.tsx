import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HealthBarProps {
  value: number;
  maxValue?: number;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export const HealthBar = ({ 
  value, 
  maxValue = 100, 
  label,
  showValue = true,
  className 
}: HealthBarProps) => {
  const percentage = Math.min((value / maxValue) * 100, 100);
  
  const getColor = () => {
    if (percentage >= 70) return "from-green-500 to-green-400";
    if (percentage >= 40) return "from-yellow-500 to-orange-400";
    return "from-red-500 to-red-400";
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-muted-foreground">{label}</span>}
          {showValue && (
            <span className="text-xs font-mono text-foreground">
              {value}/{maxValue}
            </span>
          )}
        </div>
      )}
      <div className="health-bar">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn("h-full rounded-full bg-gradient-to-r", getColor())}
        />
      </div>
    </div>
  );
};

interface SkillBarProps {
  skill: string;
  level: number;
  maxLevel?: number;
}

export const SkillBar = ({ skill, level, maxLevel = 100 }: SkillBarProps) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{skill}</span>
        <span className="font-mono text-primary">{level}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${(level / maxLevel) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
        />
      </div>
    </div>
  );
};
