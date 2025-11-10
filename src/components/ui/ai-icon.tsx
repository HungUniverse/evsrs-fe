import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIIconProps {
  className?: string;
  size?: number;
}

export function AIIcon({ className, size = 24 }: AIIconProps) {
  return (
    <div className="relative inline-flex">
      <Sparkles
        size={size}
        className={cn(
          "text-purple-600 dark:text-purple-400",
          "animate-pulse",
          className
        )}
      />
      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

