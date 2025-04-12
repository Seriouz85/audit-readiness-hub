
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Standard } from "@/types";
import { BookOpen, FileText, BarChart3, FileDown } from "lucide-react";
import { Link } from "react-router-dom";

interface StandardCardProps {
  standard: Standard;
  requirementCount: number;
  onExport?: (id: string) => void;
  horizontal?: boolean;
}

export function StandardCard({ standard, requirementCount, onExport, horizontal = false }: StandardCardProps) {
  return (
    <Card className={`h-full flex flex-col overflow-hidden border-muted transition-all duration-200 hover:border-primary/50 hover:shadow-md ${horizontal ? 'flex-row' : ''}`}>
      <div className={horizontal ? 'flex-1' : 'flex flex-col'}>
        <CardHeader className={`pb-2 ${horizontal ? 'flex-shrink-0' : ''}`}>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg line-clamp-1">{standard.name}</CardTitle>
              <CardDescription>Version {standard.version}</CardDescription>
            </div>
            <div className="px-2 py-1 text-xs font-medium rounded bg-muted shrink-0 ml-2">
              {standard.type}
            </div>
          </div>
        </CardHeader>
        <CardContent className={`${horizontal ? 'py-6 px-6' : 'flex-grow pb-2'}`}>
          <p className={`text-sm text-muted-foreground ${horizontal ? 'mb-0' : 'mb-4'} ${horizontal ? '' : 'line-clamp-3'}`}>
            {standard.description}
          </p>
          {!horizontal && (
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <BookOpen size={16} className="text-muted-foreground" />
                <span className="font-medium">{requirementCount} requirements</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText size={16} className="text-muted-foreground" />
                <span className="line-clamp-1">{standard.category}</span>
              </div>
            </div>
          )}
        </CardContent>
      </div>
      <div className={horizontal ? 'flex flex-col justify-between border-l bg-muted/5 p-4 min-w-[200px]' : ''}>
        {horizontal && (
          <div className="mb-4">
            <div className="flex items-center gap-1 mb-2">
              <BookOpen size={16} className="text-muted-foreground" />
              <span className="font-medium">{requirementCount} requirements</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText size={16} className="text-muted-foreground" />
              <span className="line-clamp-1">{standard.category}</span>
            </div>
          </div>
        )}
        <CardFooter className={`flex gap-2 ${horizontal ? 'p-0 border-0 bg-transparent flex-wrap' : 'pt-2 border-t bg-muted/10'}`}>
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link to={`/requirements?standard=${standard.id}`}>
              <BookOpen size={16} className="mr-2" />
              <span className="hidden sm:inline">Requirements</span>
              <span className="sm:hidden">View</span>
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onExport?.(standard.id)}>
            <FileDown size={16} className="mr-2" />
            <span className="hidden sm:inline">Export</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button variant="default" size="sm" asChild className="flex-1">
            <Link to={`/assessments?standard=${standard.id}`}>
              <BarChart3 size={16} className="mr-2" />
              <span className="hidden sm:inline">Assess</span>
              <span className="sm:hidden">Assess</span>
            </Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
