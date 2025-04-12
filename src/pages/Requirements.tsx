
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RequirementTable } from "@/components/requirements/RequirementTable";
import { RequirementDetail } from "@/components/requirements/RequirementDetail";
import { requirements, standards } from "@/data/mockData";
import { Requirement, RequirementStatus, Standard } from "@/types";
import { ArrowLeft, Filter, Plus, Search } from "lucide-react";

const Requirements = () => {
  const [searchParams] = useSearchParams();
  const standardIdFromUrl = searchParams.get("standard");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequirementStatus | "all">("all");
  const [standardFilter, setStandardFilter] = useState<string>(standardIdFromUrl || "all");
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);
  const [localRequirements, setLocalRequirements] = useState<Requirement[]>(requirements);

  useEffect(() => {
    if (standardIdFromUrl) {
      setStandardFilter(standardIdFromUrl);
    }
  }, [standardIdFromUrl]);

  const filteredRequirements = localRequirements.filter((requirement) => {
    const matchesSearch = 
      requirement.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      requirement.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      requirement.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || requirement.status === statusFilter;
    const matchesStandard = standardFilter === "all" || requirement.standardId === standardFilter;
    
    return matchesSearch && matchesStatus && matchesStandard;
  });

  const handleRequirementSelect = (requirement: Requirement) => {
    setSelectedRequirement(requirement);
  };

  const handleStatusChange = (id: string, status: RequirementStatus) => {
    setLocalRequirements(
      localRequirements.map((req) => (req.id === id ? { ...req, status } : req))
    );
    
    if (selectedRequirement && selectedRequirement.id === id) {
      setSelectedRequirement({ ...selectedRequirement, status });
    }
  };

  const handleEvidenceChange = (id: string, evidence: string) => {
    setLocalRequirements(
      localRequirements.map((req) => (req.id === id ? { ...req, evidence } : req))
    );
    
    if (selectedRequirement && selectedRequirement.id === id) {
      setSelectedRequirement({ ...selectedRequirement, evidence });
    }
  };

  const handleNotesChange = (id: string, notes: string) => {
    setLocalRequirements(
      localRequirements.map((req) => (req.id === id ? { ...req, notes } : req))
    );
    
    if (selectedRequirement && selectedRequirement.id === id) {
      setSelectedRequirement({ ...selectedRequirement, notes });
    }
  };

  const getStandardName = (id: string): string => {
    const standard = standards.find(s => s.id === id);
    return standard ? standard.name : id;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          {selectedRequirement ? (
            <Button 
              variant="ghost" 
              onClick={() => setSelectedRequirement(null)}
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to requirements
            </Button>
          ) : (
            <h1 className="text-3xl font-bold tracking-tight">Requirements</h1>
          )}
          {standardFilter !== "all" && !selectedRequirement && (
            <div className="text-sm text-muted-foreground mt-1">
              Viewing requirements for: {getStandardName(standardFilter)}
            </div>
          )}
        </div>
        
        {!selectedRequirement && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Requirement
          </Button>
        )}
      </div>
      
      {!selectedRequirement && (
        <>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-auto sm:flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search requirements..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select 
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as RequirementStatus | "all")}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="fulfilled">Fulfilled</SelectItem>
                  <SelectItem value="partially-fulfilled">Partially Fulfilled</SelectItem>
                  <SelectItem value="not-fulfilled">Not Fulfilled</SelectItem>
                  <SelectItem value="not-applicable">Not Applicable</SelectItem>
                </SelectContent>
              </Select>
              
              {standardIdFromUrl === null && (
                <Select 
                  value={standardFilter}
                  onValueChange={setStandardFilter}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Standard" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Standards</SelectItem>
                    {standards.map((standard) => (
                      <SelectItem key={standard.id} value={standard.id}>
                        {standard.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          
          <RequirementTable 
            requirements={filteredRequirements} 
            onSelectRequirement={handleRequirementSelect}
          />
        </>
      )}
      
      {selectedRequirement && (
        <RequirementDetail 
          requirement={selectedRequirement}
          onStatusChange={handleStatusChange}
          onEvidenceChange={handleEvidenceChange}
          onNotesChange={handleNotesChange}
        />
      )}
    </div>
  );
};

export default Requirements;
