
// Standard types
export type StandardType = 'framework' | 'regulation' | 'policy' | 'guideline';

export interface Standard {
  id: string;
  name: string;
  version: string;
  type: StandardType;
  description: string;
  category: string;
  requirements: string[]; // Array of requirement IDs
  createdAt: string;
  updatedAt: string;
}

// Requirement status types
export type RequirementStatus = 'fulfilled' | 'partially-fulfilled' | 'not-fulfilled' | 'not-applicable';

// Requirement types
export interface Requirement {
  id: string;
  standardId: string;
  section: string;
  code: string;
  name: string;
  description: string;
  guidance: string;
  status: RequirementStatus;
  evidence?: string;
  notes?: string;
  responsibleParty?: string;
  lastAssessmentDate?: string;
  createdAt: string;
  updatedAt: string;
}

// Assessment types
export interface Assessment {
  id: string;
  name: string;
  description: string;
  standardId: string;
  status: 'draft' | 'in-progress' | 'completed';
  progress: number; // Percentage of completion
  startDate: string;
  endDate?: string;
  assessorName: string;
  createdAt: string;
  updatedAt: string;
}

// Dashboard stats
export interface ComplianceStats {
  totalStandards: number;
  totalRequirements: number;
  totalAssessments: number;
  complianceScore: number;
  requirementStatusCounts: {
    fulfilled: number;
    partiallyFulfilled: number;
    notFulfilled: number;
    notApplicable: number;
  };
}
