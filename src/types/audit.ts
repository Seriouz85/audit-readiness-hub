export type RequirementStatus = 'FULFILLED' | 'PARTIALLY_FULFILLED' | 'NOT_FULFILLED' | 'NOT_APPLICABLE';
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface Requirement {
  id?: string;
  name: string;
  description: string;
  category: string;
  status: RequirementStatus;
  priority: Priority;
  tags: string[];
  dueDate?: Date;
  assignedTo?: string;
  notes?: string;
  complianceScore: number;
  variables: Variable[];
  lastUpdated?: Date;
  createdAt?: Date;
}

export interface Variable {
  id?: string;
  name: string;
  value: string;
  requirementId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RequirementHistory {
  id?: string;
  requirementId: string;
  status: RequirementStatus;
  comment?: string;
  updatedBy: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'auditor' | 'user';
  lastLogin?: Date;
} 