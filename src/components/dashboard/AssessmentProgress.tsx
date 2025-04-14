import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Assessment } from "@/types";
import { CalendarDays, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AssessmentProgressProps {
  assessments: Assessment[];
}

export function AssessmentProgress({ assessments }: AssessmentProgressProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const navigate = useNavigate();

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

  // Navigate to assessment detail page
  const handleNavigateToAssessment = (assessment: Assessment) => {
    navigate(`/assessments?id=${assessment.id}`);
  };

  return (
    <Card className="h-full shadow-xl hover:shadow-2xl transition-all duration-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Recent Assessments
            </CardTitle>
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
                <motion.div 
                  key={assessment.id} 
                  className="space-y-3 p-3 rounded-lg transition-all duration-300 ease-in-out hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-sm hover:shadow-md cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  onClick={() => handleNavigateToAssessment(assessment)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium text-base flex items-center gap-2">
                        {assessment.name}
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight size={14} className="text-blue-500" />
                        </motion.div>
                      </div>
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
                  <motion.div 
                    className="text-xs text-muted-foreground flex justify-between items-center pt-1 overflow-hidden"
                    initial={{ maxHeight: 0, opacity: 0 }}
                    animate={{ 
                      maxHeight: isHovered ? '2rem' : '0',
                      opacity: isHovered ? 1 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <span>Assessor: {assessment.assessorName}</span>
                    <span>Last updated: {formatDate(assessment.updatedAt)}</span>
                  </motion.div>
                </motion.div>
              );
            })}
            
            <motion.div 
              className="mt-4 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Button 
                variant="outline" 
                size="sm" 
                className="group"
                onClick={() => navigate('/assessments')}
              >
                View All Assessments
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground bg-slate-50 dark:bg-slate-800/30 rounded-lg">
            <Clock size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
            <p className="font-medium">No assessments found</p>
            <p className="text-sm mt-1">Create an assessment to get started</p>
            
            <motion.div className="mt-4" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/assessments')}
              >
                Go to Assessments
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
