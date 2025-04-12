
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Standard } from "@/types";
import { BookOpen, FileText, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

interface StandardCardProps {
  standard: Standard;
  requirementCount: number;
}

export function StandardCard({ standard, requirementCount }: StandardCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{standard.name}</CardTitle>
            <CardDescription>Version {standard.version}</CardDescription>
          </div>
          <div className="px-2 py-1 text-xs font-medium rounded bg-muted">
            {standard.type}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4">
          {standard.description}
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1">
            <BookOpen size={16} className="text-muted-foreground" />
            <span>{requirementCount} requirements</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText size={16} className="text-muted-foreground" />
            <span>{standard.category}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-2">
        <Button variant="outline" size="sm" asChild className="flex-1">
          <Link to={`/requirements?standard=${standard.id}`}>
            <BookOpen size={16} className="mr-2" />
            Requirements
          </Link>
        </Button>
        <Button variant="default" size="sm" asChild className="flex-1">
          <Link to={`/assessments?standard=${standard.id}`}>
            <BarChart3 size={16} className="mr-2" />
            Assess
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
