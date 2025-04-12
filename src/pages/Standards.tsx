
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StandardCard } from "@/components/standards/StandardCard";
import { standards, requirements } from "@/data/mockData";
import { StandardType } from "@/types";
import { Plus, Search } from "lucide-react";

const Standards = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<StandardType | "all">("all");

  const filteredStandards = standards.filter((standard) => {
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Standards & Regulations</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Standard
        </Button>
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
        <Select 
          value={typeFilter}
          onValueChange={(value) => setTypeFilter(value as StandardType | "all")}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
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
      </div>
      
      {filteredStandards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStandards.map((standard) => (
            <StandardCard 
              key={standard.id} 
              standard={standard}
              requirementCount={getRequirementCount(standard.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No standards found</h3>
          <p className="text-muted-foreground mt-1">
            Adjust your search or add a new standard.
          </p>
        </div>
      )}
    </div>
  );
};

export default Standards;
