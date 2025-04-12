
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Requirement } from "@/types";

interface RequirementTableProps {
  requirements: Requirement[];
  onSelectRequirement?: (requirement: Requirement) => void;
}

export function RequirementTable({ requirements, onSelectRequirement }: RequirementTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead className="w-[300px]">Requirement</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Assessment</TableHead>
            <TableHead>Responsible</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requirements.length > 0 ? (
            requirements.map((req) => (
              <TableRow 
                key={req.id}
                onClick={() => onSelectRequirement?.(req)}
                className={onSelectRequirement ? "cursor-pointer hover:bg-muted/50" : ""}
              >
                <TableCell className="font-medium">{req.code}</TableCell>
                <TableCell>{req.name}</TableCell>
                <TableCell>
                  <StatusBadge status={req.status} />
                </TableCell>
                <TableCell>
                  {req.lastAssessmentDate 
                    ? new Date(req.lastAssessmentDate).toLocaleDateString() 
                    : 'Never'}
                </TableCell>
                <TableCell>{req.responsibleParty || 'Unassigned'}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No requirements found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
