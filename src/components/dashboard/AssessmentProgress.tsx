import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Assessment } from "@/types";
import { CalendarDays, Clock } from "lucide-react";
import { useState } from "react";

interface AssessmentProgressProps {
  assessments: Assessment[];
}

export function AssessmentProgress({ assessments }: AssessmentProgressProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Sort by most recent first
  const sortedAssessments = [...assessments]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Calculate days since start
  const getDaysSinceStart = (startDate: string) => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Get color scheme based on status
  const getStatusColors = (status: string) => {
    switch(status) {
      case "completed":
        return {
          bg: "bg-green-100 dark:bg-green-900/20",
          text: "text-green-800 dark:text-green-400",
          progressColor: "bg-green-500"
        };
      case "in-progress":
        return {
          bg: "bg-blue-100 dark:bg-blue-900/20",
          text: "text-blue-800 dark:text-blue-400",
          progressColor: "bg-blue-500"
        };
      default:
        return {
          bg: "bg-gray-100 dark:bg-gray-800",
          text: "text-gray-800 dark:text-gray-400",
          progressColor: "bg-gray-500"
        };
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Recent Assessments</CardTitle>
            <CardDescription>Assessment progress tracking</CardDescription>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1 text-xs font-medium">
            {sortedAssessments.length} of {assessments.length} shown
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sortedAssessments.length > 0 ? (
          <div className="space-y-5">
            {sortedAssessments.map((assessment, index) => {
              const statusColors = getStatusColors(assessment.status);
              const isHovered = hoveredIndex === index;
              const daysSinceStart = getDaysSinceStart(assessment.startDate);
              
              return (
                <div 
                  key={assessment.id} 
                  className="space-y-3 p-3 rounded-lg transition-all duration-300 ease-in-out hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-base">{assessment.name}</div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1 gap-2">
                        <CalendarDays size={14} />
                        <span>Started {formatDate(assessment.startDate)}</span>
                        {daysSinceStart > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700">
                            {daysSinceStart} days ago
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors.bg} ${statusColors.text}`}
                      >
                        {assessment.status === "completed"
                          ? "Completed"
                          : assessment.status === "in-progress"
                          ? "In Progress"
                          : "Draft"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <Progress 
                        value={assessment.progress} 
                        className={`transition-all duration-300 ease-in-out ${
                          assessment.status === "completed"
                            ? "bg-green-100 [&>div]:bg-green-500" 
                            : assessment.status === "in-progress"
                            ? "bg-blue-100 [&>div]:bg-blue-500"
                            : "bg-gray-100 [&>div]:bg-gray-500"
                        }`}
                        style={{
                          height: isHovered ? '0.75rem' : '0.625rem'
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-1 bg-white dark:bg-gray-800 shadow-sm px-2 py-1 rounded">
                      <Clock size={14} className={statusColors.text} />
                      <span className="text-sm font-medium">{assessment.progress}%</span>
                    </div>
                  </div>
                  <div 
                    className="text-xs text-muted-foreground flex justify-between items-center pt-1 overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                      maxHeight: isHovered ? '2rem' : '0',
                      opacity: isHovered ? 1 : 0
                    }}
                  >
                    <span>Assessor: {assessment.assessorName}</span>
                    <span>Last updated: {formatDate(assessment.updatedAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground bg-slate-50 dark:bg-slate-800/30 rounded-lg">
            <Clock size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <p className="font-medium">No assessments found</p>
            <p className="text-sm mt-1">Create an assessment to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
