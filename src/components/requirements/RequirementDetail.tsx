import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/ui/status-badge";
import { Requirement, RequirementStatus } from "@/types";
import { useState } from "react";
import { toast } from "@/utils/toast";

interface RequirementDetailProps {
  requirement: Requirement;
  onStatusChange?: (id: string, status: RequirementStatus) => void;
  onEvidenceChange?: (id: string, evidence: string) => void;
  onNotesChange?: (id: string, notes: string) => void;
}

export function RequirementDetail({ 
  requirement,
  onStatusChange,
  onEvidenceChange,
  onNotesChange
}: RequirementDetailProps) {
  const [evidence, setEvidence] = useState(requirement.evidence || '');
  const [notes, setNotes] = useState(requirement.notes || '');
  const [status, setStatus] = useState<RequirementStatus>(requirement.status);

  const handleStatusChange = (value: RequirementStatus) => {
    setStatus(value);
    onStatusChange?.(requirement.id, value);
  };

  const handleEvidenceSave = () => {
    onEvidenceChange?.(requirement.id, evidence);
    toast.success("Evidence updated successfully");
  };

  const handleNotesSave = () => {
    onNotesChange?.(requirement.id, notes);
    toast.success("Notes updated successfully");
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs font-medium text-muted-foreground mb-1">
              {requirement.code} | {requirement.section}
            </div>
            <CardTitle>{requirement.name}</CardTitle>
            <CardDescription>
              {requirement.standardId}
            </CardDescription>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Description</h3>
          <p className="text-sm text-muted-foreground">{requirement.description}</p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium mb-2">Guidance</h3>
          <p className="text-sm text-muted-foreground">{requirement.guidance}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="status">Compliance Status</Label>
          </div>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fulfilled">Fulfilled</SelectItem>
              <SelectItem value="partially-fulfilled">Partially Fulfilled</SelectItem>
              <SelectItem value="not-fulfilled">Not Fulfilled</SelectItem>
              <SelectItem value="not-applicable">Not Applicable</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="evidence">Evidence</Label>
            <Button variant="ghost" size="sm" onClick={handleEvidenceSave}>
              Save
            </Button>
          </div>
          <Textarea
            id="evidence"
            placeholder="Document evidence of compliance..."
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            rows={4}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="notes">Notes</Label>
            <Button variant="ghost" size="sm" onClick={handleNotesSave}>
              Save
            </Button>
          </div>
          <Textarea
            id="notes"
            placeholder="Add notes or comments..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-between text-sm text-muted-foreground">
          <div>Last updated: {new Date(requirement.updatedAt).toLocaleString()}</div>
          <div>Responsible: {requirement.responsibleParty || 'Unassigned'}</div>
        </div>
      </CardFooter>
    </Card>
  );
}
