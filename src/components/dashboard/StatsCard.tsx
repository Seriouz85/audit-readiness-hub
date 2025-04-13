import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  className 
}: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden group", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </CardTitle>
        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1 group-hover:scale-105 origin-left transition-transform">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mb-2">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2 bg-slate-50 dark:bg-slate-800 p-1.5 px-2 rounded-lg w-fit">
            <span
              className={cn(
                "text-xs font-medium flex items-center",
                trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              )}
            >
              {trend.isPositive ? (
                <ArrowUpIcon size={14} className="mr-1" />
              ) : (
                <ArrowDownIcon size={14} className="mr-1" />
              )}
              {Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
