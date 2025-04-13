import React, { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Supplier, Standard, Requirement, InternalUser, RequirementStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { 
  CheckSquare, 
  Download, 
  FileText, 
  Filter, 
  Mail, 
  Printer, 
  Send, 
  X, 
  ChevronDown,
  BarChart3,
  AlertCircle,
  Check,
  Shield,
  AlertTriangle,
  User,
  Phone,
  Building,
  ShieldCheck,
  FileDown
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/lib/i18n';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/utils/toast';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { format } from 'date-fns';

interface SupplierReviewReportProps {
  supplier: Supplier;
  standards: Standard[];
  requirements: Requirement[];
  internalUser: InternalUser;
  onClose: () => void;
  onSend?: (emailData: EmailData) => void;
  previewMode?: boolean;
  directExport?: {
    standardId: string;
    onComplete?: () => void;
  };
}

interface EmailData {
  to: string;
  subject: string;
  message: string;
  includeRequirements: boolean;
  standardIds: string[];
}

interface RequirementWithStatus extends Requirement {
  supplierStatus?: RequirementStatus;
  supplierNotes?: string;
  supplierEvidence?: string;
}

export const SupplierReviewReport = ({ 
  supplier, 
  standards, 
  requirements,
  internalUser,
  onClose,
  onSend,
  previewMode = false,
  directExport
}: SupplierReviewReportProps) => {
  const { t } = useTranslation();
  const reportRef = useRef<HTMLDivElement>(null);
  const [activeStandardId, setActiveStandardId] = useState<string | undefined>(
    supplier.associatedStandards.length > 0 ? supplier.associatedStandards[0].standardId : undefined
  );
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showStandardsDialog, setShowStandardsDialog] = useState(false);
  const [enhancedRequirements, setEnhancedRequirements] = useState<RequirementWithStatus[]>([]);
  const [selectedStandardIds, setSelectedStandardIds] = useState<string[]>(
    supplier.associatedStandards.map(s => s.standardId)
  );
  const [emailData, setEmailData] = useState<EmailData>({
    to: supplier.contact.email,
    subject: `Security Requirements Review from ${internalUser.department || 'Our Company'}`,
    message: `Dear ${supplier.contact.name},\n\nAs part of our ongoing supplier security assessment program, we're sending you the attached security requirements that apply to your organization.\n\nPlease review these requirements and provide evidence of compliance at your earliest convenience.\n\nBest regards,\n${internalUser.name}\n${internalUser.title || 'Security Team'}\n${internalUser.email}`,
    includeRequirements: true,
    standardIds: supplier.associatedStandards.map(s => s.standardId)
  });
  
  // Get selected standards
  const selectedStandards = standards.filter(std => 
    selectedStandardIds.includes(std.id)
  );
  
  // Enhanced requirements with status
  useEffect(() => {
    const enhanced = requirements.map(req => {
      const relatedRequirement = supplier.associatedStandards
        .find(s => s.standardId === req.standardId)?.requirementIds
        .includes(req.id);
      
      return {
        ...req,
        supplierStatus: relatedRequirement ? 'fulfilled' : 'not-fulfilled' as RequirementStatus,
        supplierNotes: '',
        supplierEvidence: '',
      };
    });
    
    // Debug
    if (enhanced.length > 0) {
      console.log({
        standardIds: standards.map(s => s.id),
        requirementsCount: requirements.length,
        requirementsForStandards: requirements.filter(req => selectedStandardIds.includes(req.standardId)).length
      });
    }
    
    setEnhancedRequirements(enhanced);
  }, [selectedStandardIds, requirements, standards, supplier.associatedStandards]);
  
  // Get filtered requirements based on active standard
  const filteredRequirements = activeStandardId 
    ? enhancedRequirements.filter(req => req.standardId === activeStandardId)
    : enhancedRequirements;
  
  // Calculate compliance statistics
  const totalRequirements = filteredRequirements.length;
  const fulfilledCount = filteredRequirements.filter(req => req.supplierStatus === 'fulfilled').length;
  const partialCount = filteredRequirements.filter(req => req.supplierStatus === 'partially-fulfilled').length;
  const notFulfilledCount = filteredRequirements.filter(req => req.supplierStatus === 'not-fulfilled').length;
  const notApplicableCount = filteredRequirements.filter(req => req.supplierStatus === 'not-applicable').length;
  
  // Data for the chart
  const chartData = [
    { name: 'Fulfilled', value: fulfilledCount, color: '#22c55e' },
    { name: 'Partial', value: partialCount, color: '#f59e0b' },
    { name: 'Not Fulfilled', value: notFulfilledCount, color: '#ef4444' },
    { name: 'Not Applicable', value: notApplicableCount, color: '#94a3b8' },
  ].filter((item) => item.value > 0);
  
  // Calculate compliance score
  const total = totalRequirements - notApplicableCount;
  const score = total > 0 
    ? Math.round((fulfilledCount + partialCount * 0.5) / total * 100) 
    : 0;
  
  // Group requirements by section for better organization
  const groupedRequirements = filteredRequirements.reduce((acc, req) => {
    const section = req.section;
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(req);
    return acc;
  }, {} as Record<string, RequirementWithStatus[]>);

  // Handle requirement status change
  const handleRequirementStatusChange = (reqId: string, status: RequirementStatus) => {
    setEnhancedRequirements(prev => 
      prev.map(req => 
        req.id === reqId ? { ...req, supplierStatus: status } : req
      )
    );
  };

  // Handle requirement notes change
  const handleRequirementNotesChange = (reqId: string, notes: string) => {
    setEnhancedRequirements(prev => 
      prev.map(req => 
        req.id === reqId ? { ...req, supplierNotes: notes } : req
      )
    );
  };

  // Handle requirement evidence change
  const handleRequirementEvidenceChange = (reqId: string, evidence: string) => {
    setEnhancedRequirements(prev => 
      prev.map(req => 
        req.id === reqId ? { ...req, supplierEvidence: evidence } : req
      )
    );
  };

  // Native browser print functionality for PDF export
  const handlePrintToPDF = useReactToPrint({
    content: () => reportRef.current,
    documentTitle: `${supplier.name} - Compliance Assessment`,
    onBeforeGetContent: () => {
      // Add a loading toast
      toast.info('Preparing document for printing...');
      
      // Add a print stylesheet to the document
      const style = document.createElement('style');
      style.id = 'print-style';
      style.innerHTML = `
        @media print {
          @page {
            size: A4;
            margin: 15mm 10mm 15mm 10mm;
          }
          
          body, html {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          body * {
            visibility: hidden;
          }
          
          .supplier-report-content, 
          .supplier-report-content * {
            visibility: visible;
          }
          
          .supplier-report-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 10mm !important;
            box-shadow: none !important;
            border: none !important;
          }
          
          .print-header {
            display: block !important;
            position: fixed;
            top: 5mm;
            width: 100%;
          }
          
          .print-footer {
            display: block !important;
            position: fixed;
            bottom: 5mm;
            width: 100%;
          }
          
          button, .no-print, .ui-control {
            display: none !important;
          }
          
          h1, h2, h3 {
            page-break-after: avoid;
          }
          
          .break-inside-avoid {
            page-break-inside: avoid;
          }
          
          .page-break-before {
            page-break-before: always;
          }
          
          table { 
            page-break-inside: auto;
            border-collapse: collapse;
          }
          
          tr { 
            page-break-inside: avoid; 
            page-break-after: auto;
          }
          
          thead { 
            display: table-header-group;
          }
          
          tfoot { 
            display: table-footer-group;
          }
        }
      `;
      document.head.appendChild(style);
      
      return Promise.resolve();
    },
    onAfterPrint: () => {
      // Remove the print stylesheet
      const style = document.getElementById('print-style');
      if (style) document.head.removeChild(style);
      
      toast.success('Document ready for save');
    },
  });

  // Auto-trigger PDF export when appropriate
  useEffect(() => {
    // Only in direct PDF export mode and not in preview mode
    if (directExport && !previewMode) {
      setTimeout(() => {
        console.log('Automatically triggering PDF export');
        handlePrintToPDF();
        
        // Call onComplete callback if provided
        if (directExport.onComplete) {
          setTimeout(() => {
            directExport.onComplete();
          }, 1000);
        }
      }, 500);
    }
  }, [directExport, previewMode, handlePrintToPDF]);

  // Handle sending email
  const handleSendEmail = () => {
    if (onSend) {
      onSend({...emailData, standardIds: selectedStandardIds});
      setShowEmailDialog(false);
      toast.success(`Requirements sent to ${supplier.contact.name}`);
    }
  };

  // Handle standards selection
  const handleStandardsSelection = () => {
    setSelectedStandardIds([...selectedStandardIds]);
    setShowStandardsDialog(false);
    
    // Update email data with selected standards
    setEmailData(prev => ({
      ...prev,
      standardIds: selectedStandardIds
    }));
    
    toast.success('Selected standards updated');
  };

  // Handle direct export mode if specified
  useEffect(() => {
    if (directExport) {
      console.log('Direct export mode activated for standard:', directExport.standardId);
      
      // Set the active standard to the one specified
      setActiveStandardId(directExport.standardId);
      setSelectedStandardIds([directExport.standardId]);
    }
  }, [directExport]);

  return (
    <div className={`${previewMode ? '' : 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50'} flex flex-col`}>
      {!previewMode && (
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            <h2 className="text-xl font-bold">Supplier Requirements Review</h2>
          </div>
          <div className="flex items-center gap-2">
            {selectedStandards.length > 0 && (
              <div className="flex items-center gap-2 mr-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select 
                  value={activeStandardId} 
                  onValueChange={(value) => setActiveStandardId(value || undefined)}
                >
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder="Filter by standard" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {selectedStandards.map(std => (
                        <SelectItem key={std.id} value={std.id}>
                          {std.name} {std.version}
                        </SelectItem>
                      ))}
                      <SelectItem value="">All Standards</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowStandardsDialog(true)} 
              className="gap-1 mr-2"
            >
              <Filter className="h-4 w-4" />
              <span>Select Standards</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrintToPDF} 
              className="gap-1 mr-2"
            >
              <Printer className="h-4 w-4" />
              <span>Generate PDF</span>
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => setShowEmailDialog(true)} 
              className="gap-1 mr-2"
            >
              <Send className="h-4 w-4" />
              <span>Send to Supplier</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="gap-1">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      
      <div className={`${previewMode ? '' : 'flex-1 overflow-auto p-6'}`}>
        <div 
          ref={reportRef} 
          className="supplier-report-content bg-white dark:bg-slate-900 max-w-4xl mx-auto p-8 shadow-sm border rounded-md print:shadow-none print:border-none print:p-6"
        >
          {/* Report Header */}
          <div className="flex justify-between items-center border-b-2 border-primary pb-4 mb-6 print:mb-8">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-white p-2 rounded-md">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{t("supplier.securityReview")}</h1>
                <p className="text-muted-foreground">{format(new Date(), "PPP")}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">{supplier?.name}</p>
              <p className="text-sm text-muted-foreground">{supplier?.organizationNumber}</p>
            </div>
          </div>
          
          {/* Print-only header */}
          <div className="hidden print:block fixed top-0 left-0 right-0 p-4 border-b bg-white text-sm text-muted-foreground">
            <div className="flex justify-between items-center">
              <div>{supplier?.name} - Compliance Assessment</div>
              <div>{format(new Date(), "PPP")}</div>
            </div>
          </div>
          
          {/* Print-only footer */}
          <div className="hidden print:block fixed bottom-0 left-0 right-0 p-4 border-t bg-white text-sm text-muted-foreground">
            <div className="flex justify-between items-center">
              <div>Generated by: {internalUser.name}</div>
              <div>Confidential</div>
            </div>
          </div>
          
          {/* Summary Statistics */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 print:text-lg">Compliance Summary</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Compliance Score */}
              <div className="bg-white border rounded-lg p-6 flex items-center justify-between shadow-sm print:border-gray-300 print:shadow-none print:p-4">
                <div>
                  <h3 className="text-lg font-semibold print:text-base">{t("assessment.complianceScore")}</h3>
                  <p className="text-sm text-muted-foreground">{t("assessment.overallCompliance")}</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="relative h-24 w-24 print:h-20 print:w-20">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold print:text-2xl">{score}%</span>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Fulfilled", value: score },
                            { name: "Remaining", value: Math.max(0, 100 - score) }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={36}
                          outerRadius={46}
                          startAngle={90}
                          endAngle={-270}
                          dataKey="value"
                        >
                          <Cell 
                            fill={
                              score >= 80 ? "#22c55e" : 
                              score >= 50 ? "#f59e0b" : 
                              "#ef4444"
                            } 
                          />
                          <Cell fill="#e5e7eb" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className={`text-sm font-semibold mt-2 ${
                    score >= 80 ? "text-green-600" : 
                    score >= 50 ? "text-amber-600" : 
                    "text-red-600"
                  }`}>
                    {score >= 80 ? t("compliance.high") : 
                     score >= 50 ? t("compliance.medium") : 
                     t("compliance.low")}
                  </div>
                </div>
              </div>
              
              {/* Requirements Status */}
              <div className="bg-white border rounded-lg p-6 shadow-sm print:border-gray-300 print:shadow-none print:p-4">
                <h3 className="text-lg font-semibold mb-4 print:text-base">{t("requirement.status.title")}</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">{t("requirement.status.fulfilled")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{fulfilledCount}</span>
                      <span className="text-sm text-muted-foreground">({fulfilledCount > 0 ? Math.round((fulfilledCount / totalRequirements) * 100) : 0}%)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                      <span className="text-sm">{t("requirement.status.partiallyFulfilled")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{partialCount}</span>
                      <span className="text-sm text-muted-foreground">({partialCount > 0 ? Math.round((partialCount / totalRequirements) * 100) : 0}%)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-sm">{t("requirement.status.notFulfilled")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{notFulfilledCount}</span>
                      <span className="text-sm text-muted-foreground">({notFulfilledCount > 0 ? Math.round((notFulfilledCount / totalRequirements) * 100) : 0}%)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-slate-400 mr-2"></div>
                      <span className="text-sm">{t("requirement.status.notApplicable")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{notApplicableCount}</span>
                      <span className="text-sm text-muted-foreground">({notApplicableCount > 0 ? Math.round((notApplicableCount / totalRequirements) * 100) : 0}%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Add a requirements summary table */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Requirements Summary</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="w-1/4 text-left">Section</th>
                    <th className="text-center">Total</th>
                    <th className="text-center text-green-600">Fulfilled</th>
                    <th className="text-center text-amber-600">Partial</th>
                    <th className="text-center text-red-600">Not Fulfilled</th>
                    <th className="text-center text-slate-600">N/A</th>
                    <th className="text-center">Compliance %</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedRequirements).map(([section, reqs]) => {
                    const sectionTotal = reqs.length;
                    const sectionFulfilled = reqs.filter(req => req.supplierStatus === 'fulfilled').length;
                    const sectionPartial = reqs.filter(req => req.supplierStatus === 'partially-fulfilled').length;
                    const sectionNotFulfilled = reqs.filter(req => req.supplierStatus === 'not-fulfilled').length;
                    const sectionNA = reqs.filter(req => req.supplierStatus === 'not-applicable').length;
                    
                    // Calculate section compliance score
                    const sectionRelevant = sectionTotal - sectionNA;
                    const sectionScore = sectionRelevant > 0 
                      ? Math.round((sectionFulfilled + sectionPartial * 0.5) / sectionRelevant * 100) 
                      : 0;
                      
                    return (
                      <tr key={section}>
                        <td className="font-medium text-left">{section}</td>
                        <td className="text-center">{sectionTotal}</td>
                        <td className="text-center text-green-600">{sectionFulfilled}</td>
                        <td className="text-center text-amber-600">{sectionPartial}</td>
                        <td className="text-center text-red-600">{sectionNotFulfilled}</td>
                        <td className="text-center text-slate-600">{sectionNA}</td>
                        <td className="text-center">
                          <div className="flex items-center justify-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  sectionScore >= 80 ? 'bg-green-500' :
                                  sectionScore >= 50 ? 'bg-amber-500' :
                                                      'bg-red-500'
                                }`}
                                style={{ width: `${sectionScore}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{sectionScore}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="font-bold bg-slate-50">
                    <td className="text-left">Total</td>
                    <td className="text-center">{totalRequirements}</td>
                    <td className="text-center text-green-600">{fulfilledCount}</td>
                    <td className="text-center text-amber-600">{partialCount}</td>
                    <td className="text-center text-red-600">{notFulfilledCount}</td>
                    <td className="text-center text-slate-600">{notApplicableCount}</td>
                    <td className="text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              score >= 80 ? 'bg-green-500' :
                              score >= 50 ? 'bg-amber-500' :
                                          'bg-red-500'
                            }`}
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{score}%</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Detailed Requirements */}
          <div className="mt-8 page-break-before">
            <h2 className="text-xl font-bold mb-4 print:text-lg">Detailed Requirements</h2>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-4 print:bg-white print:border print:border-blue-200 print:mb-6">
              <p className="text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-500" />
                <span>Select a status for each requirement using the dropdown menus. Your selections will automatically update the compliance summary.</span>
              </p>
            </div>
            
            {Object.entries(groupedRequirements).length > 0 ? (
              Object.entries(groupedRequirements).map(([section, requirements]) => (
                <div key={section} className="mb-6 break-inside-avoid">
                  <h3 className="text-lg font-semibold mb-2 border-b pb-1 print:text-base print:border-gray-400">{section}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse print:border print:border-gray-300">
                      <thead className="print:bg-gray-100">
                        <tr className="bg-gray-100">
                          <th className="px-2 py-2 text-left border text-sm print:font-bold print:py-1">Requirement</th>
                          <th className="px-2 py-2 text-center border w-24 text-sm print:font-bold print:py-1 print:w-auto">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requirements.map((req) => (
                          <tr key={req.id} className="border-b hover:bg-gray-50 print:border print:border-gray-200">
                            <td className="px-2 py-3 border text-sm print:py-2">
                              <div className="font-medium print:font-semibold">{req.name}</div>
                              <div className="text-xs text-gray-600 mt-1 print:text-sm">{req.description}</div>
                            </td>
                            <td className="px-2 py-3 border text-center print:py-2">
                              <div className="print:hidden">
                                <Select
                                  value={req.supplierStatus}
                                  onValueChange={(value: RequirementStatus) => handleRequirementStatusChange(req.id, value)}
                                >
                                  <SelectTrigger className="h-8 text-xs w-full max-w-[160px] mx-auto">
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="fulfilled" className="text-green-600">
                                      {t("requirement.status.fulfilled")}
                                    </SelectItem>
                                    <SelectItem value="partially-fulfilled" className="text-amber-600">
                                      {t("requirement.status.partiallyFulfilled")}
                                    </SelectItem>
                                    <SelectItem value="not-fulfilled" className="text-red-600">
                                      {t("requirement.status.notFulfilled")}
                                    </SelectItem>
                                    <SelectItem value="not-applicable" className="text-slate-600">
                                      {t("requirement.status.notApplicable")}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              {/* Status indicator optimized for print */}
                              <div className="hidden print:block">
                                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium
                                  ${
                                    req.supplierStatus === "fulfilled"
                                      ? "bg-green-100 text-green-800"
                                      : req.supplierStatus === "partially-fulfilled"
                                      ? "bg-amber-100 text-amber-800"
                                      : req.supplierStatus === "not-applicable"
                                      ? "bg-slate-100 text-slate-800"
                                      : "bg-red-100 text-red-800"
                                  }
                                `}>
                                  {req.supplierStatus === "fulfilled"
                                    ? t("requirement.status.fulfilled")
                                    : req.supplierStatus === "partially-fulfilled"
                                    ? t("requirement.status.partiallyFulfilled")
                                    : req.supplierStatus === "not-applicable"
                                    ? t("requirement.status.notApplicable")
                                    : t("requirement.status.notFulfilled")}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 border rounded-md">
                <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                <h3 className="text-lg font-medium">No requirements found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  There are no requirements available for the selected standards.
                </p>
              </div>
            )}
          </div>
          
          {/* Report Footer */}
          <div className="mt-10 pt-4 border-t text-sm text-center text-muted-foreground">
            <p>Generated by: {internalUser.name} ({internalUser.email})</p>
            <p className="mt-1">This assessment is confidential and contains information intended only for the supplier named above.</p>
          </div>
        </div>
      </div>
    </div>
  );
};