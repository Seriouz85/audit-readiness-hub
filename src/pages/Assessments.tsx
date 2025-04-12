
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { assessments, standards } from "@/data/mockData";
import { BarChart, Calendar, CheckCircle2, Clock, User } from "lucide-react";

const Assessments = () => {
  const [searchParams] = useSearchParams();
  const standardIdFromUrl = searchParams.get("standard");
  
  const filteredAssessments = standardIdFromUrl
    ? assessments.filter(assessment => assessment.standardId === standardIdFromUrl)
    : assessments;
  
  const getStandardName = (id: string): string => {
    const standard = standards.find(s => s.id === id);
    return standard ? standard.name : id;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assessments</h1>
          {standardIdFromUrl && (
            <div className="text-sm text-muted-foreground mt-1">
              Viewing assessments for: {getStandardName(standardIdFromUrl)}
            </div>
          )}
        </div>
        <Button>
          <BarChart className="h-4 w-4 mr-2" />
          New Assessment
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAssessments.map((assessment) => (
          <Card key={assessment.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{assessment.name}</CardTitle>
                  <CardDescription>{getStandardName(assessment.standardId)}</CardDescription>
                </div>
                <div 
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    assessment.status === 'completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                      : assessment.status === 'in-progress' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}
                >
                  {assessment.status === 'completed' 
                    ? 'Completed' 
                    : assessment.status === 'in-progress' 
                    ? 'In Progress' 
                    : 'Draft'}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {assessment.description}
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Progress</span>
                  <span className="font-medium">{assessment.progress}%</span>
                </div>
                <Progress value={assessment.progress} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-muted-foreground" />
                  <span>Started: {new Date(assessment.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-muted-foreground" />
                  <span>Assessor: {assessment.assessorName}</span>
                </div>
                {assessment.endDate && (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-muted-foreground" />
                    <span>Completed: {new Date(assessment.endDate).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground" />
                  <span>Last updated: {new Date(assessment.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-4">
              <Button variant="default" className="flex-1">
                Continue Assessment
              </Button>
              <Button variant="outline" className="flex-1">
                View Report
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {filteredAssessments.length === 0 && (
          <div className="col-span-2 text-center py-12">
            <h3 className="text-lg font-medium">No assessments found</h3>
            <p className="text-muted-foreground mt-1">
              Create a new assessment to start tracking your compliance.
            </p>
            <Button className="mt-4">
              <BarChart className="h-4 w-4 mr-2" />
              New Assessment
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assessments;
