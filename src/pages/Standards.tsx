
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StandardCard } from "@/components/standards/StandardCard";
import { standards, requirements } from "@/data/mockData";
import { StandardType } from "@/types";
import { Plus, Search, Filter, FileDown, FileUp, LayoutGrid, Rows3 } from "lucide-react";
import { toast } from "@/utils/toast";

const Standards = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<StandardType | "all">("all");
  const [visibleStandards, setVisibleStandards] = useState(standards);
  const [isGridView, setIsGridView] = useState(true);

  const filteredStandards = visibleStandards.filter((standard) => {
    const matchesSearch = 
      standard.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      standard.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      standard.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || standard.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Calculate requirements count for each standard
  const getRequirementCount = (standardId: string) => {
    return requirements.filter(req => req.standardId === standardId).length;
  };

  const importStandard = () => {
    toast.success("Standard imported successfully");
  };

  const exportStandard = (id: string) => {
    toast.success(`Standard ${id} exported successfully`);
  };

  const toggleView = () => {
    setIsGridView(!isGridView);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Standards & Regulations</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={importStandard}>
            <FileUp className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Standard
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-auto sm:flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search standards..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select 
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value as StandardType | "all")}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="framework">Framework</SelectItem>
              <SelectItem value="regulation">Regulation</SelectItem>
              <SelectItem value="policy">Policy</SelectItem>
              <SelectItem value="guideline">Guideline</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={toggleView} title={isGridView ? "Switch to row view" : "Switch to grid view"}>
            {isGridView ? <Rows3 className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <div className="bg-muted/50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Available Standards</h2>
        <p className="text-muted-foreground">
          Browse, filter, and manage your cybersecurity standards and regulations. Click on a standard to view its requirements.
        </p>
      </div>
      
      {filteredStandards.length > 0 ? (
        <>
          {isGridView ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStandards.map((standard) => (
                <StandardCard 
                  key={standard.id} 
                  standard={standard}
                  requirementCount={getRequirementCount(standard.id)}
                  onExport={() => exportStandard(standard.id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredStandards.map((standard) => (
                <div key={standard.id} className="flex overflow-x-auto pb-2">
                  <div className="min-w-full md:min-w-[600px] lg:min-w-[800px]">
                    <StandardCard 
                      standard={standard}
                      requirementCount={getRequirementCount(standard.id)}
                      onExport={() => exportStandard(standard.id)}
                      horizontal={true}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-background">
          <h3 className="text-lg font-medium">No standards found</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            Adjust your search or add a new standard.
          </p>
          <Button variant="outline" onClick={() => {
            setSearchQuery("");
            setTypeFilter("all");
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      <div className="bg-muted/30 p-6 rounded-lg border border-dashed border-muted-foreground/30">
        <h2 className="text-lg font-medium mb-2">ISO 27001:2022 Details</h2>
        <p className="text-muted-foreground mb-4">
          ISO/IEC 27001:2022 is the latest version of the international standard for information security management systems (ISMS).
          It includes controls across multiple domains to help organizations establish, implement, maintain, and continually improve an ISMS.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div className="p-3 bg-background rounded border">
            <h3 className="font-medium">A5-A8</h3>
            <p className="text-sm text-muted-foreground">Security Policies, Organization, Human Resources, Asset Management</p>
          </div>
          <div className="p-3 bg-background rounded border">
            <h3 className="font-medium">A9-A12</h3>
            <p className="text-sm text-muted-foreground">Access Control, Cryptography, Physical Security, Operations</p>
          </div>
          <div className="p-3 bg-background rounded border">
            <h3 className="font-medium">A13-A18</h3>
            <p className="text-sm text-muted-foreground">Communications, System Acquisition, Supplier Relationships, Incident Management</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Standards;
