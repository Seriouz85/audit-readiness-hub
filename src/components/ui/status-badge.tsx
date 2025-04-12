
import { cn } from "@/lib/utils";
import { RequirementStatus } from "@/types";

interface StatusBadgeProps {
  status: RequirementStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const statusConfig = {
    "fulfilled": {
      label: "Fulfilled",
      className: "status-fulfilled",
    },
    "partially-fulfilled": {
      label: "Partially Fulfilled",
      className: "status-partially",
    },
    "not-fulfilled": {
      label: "Not Fulfilled",
      className: "status-not-fulfilled",
    },
    "not-applicable": {
      label: "Not Applicable",
      className: "status-not-applicable",
    },
  };

  const config = statusConfig[status];

  return (
    <span 
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
