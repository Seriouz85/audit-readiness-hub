
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Assessment } from "@/types";

interface AssessmentProgressProps {
  assessments: Assessment[];
}

export function AssessmentProgress({ assessments }: AssessmentProgressProps) {
  // Sort by most recent first
  const sortedAssessments = [...assessments]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Recent Assessments</CardTitle>
        <CardDescription>Assessment progress tracking</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedAssessments.length > 0 ? (
          <div className="space-y-6">
            {sortedAssessments.map((assessment) => (
              <div key={assessment.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{assessment.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Started {new Date(assessment.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                        assessment.status === "completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : assessment.status === "in-progress"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {assessment.status === "completed"
                        ? "Completed"
                        : assessment.status === "in-progress"
                        ? "In Progress"
                        : "Draft"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={assessment.progress} className="h-2" />
                  <span className="text-sm font-medium">{assessment.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No assessments found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
