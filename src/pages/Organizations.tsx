import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { Building, PlusCircle, Eye, Edit, Trash2, MapPin, Phone, Mail, User, Tag, ListChecks, CheckCircle, XCircle, Clock, MinusCircle, Info } from 'lucide-react';

// --- Data Structures ---
const organizationTypes = ["Parent", "Subsidiary", "Critical Vendor", "Other Third Party"] as const;
const complianceScopes = ["SOC2", "ISO27001", "PCI-DSS", "GDPR", "CCPA", "HIPAA"] as const;
const requirementStatuses = ["Fulfilled", "Not Fulfilled", "Partially Fulfilled", "In Progress", "Not Applicable"] as const;

type OrganizationType = typeof organizationTypes[number];
type ComplianceScope = typeof complianceScopes[number];
type RequirementStatus = typeof requirementStatuses[number];

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  parentId?: string; // ID of the parent organization
  corporateId?: string; 
  address: {
    street: string;
    city: string;
    state?: string;
    zip: string;
    country: string;
  };
  securityContact: {
    name: string;
    email: string;
  };
  legalContact?: {
    name: string;
    email: string;
  };
  description?: string;
  complianceScopeTags: ComplianceScope[];
}

// Mock data for demonstration
export const mockOrganizations: Organization[] = [
  {
    id: "org-parent-1",
    name: "Global Tech Solutions",
    type: "Parent",
    corporateId: "GT12345678",
    address: {
      street: "1 Innovation Drive",
      city: "Metropolis",
      state: "CA",
      zip: "90210",
      country: "USA",
    },
    securityContact: {
      name: "Alice Secure",
      email: "alice.secure@globaltech.com",
    },
    legalContact: {
      name: "Bob Lawful",
      email: "bob.lawful@globaltech.com",
    },
    description: "Leading provider of cloud infrastructure and AI solutions.",
    complianceScopeTags: ["SOC2", "ISO27001", "GDPR"],
  },
  {
    id: "org-sub-1",
    name: "Innovate Software Ltd.",
    type: "Subsidiary",
    parentId: "org-parent-1",
    corporateId: "ISL987654",
    address: {
      street: "42 Development Ave",
      city: "London",
      zip: "EC1A 1BB",
      country: "UK",
    },
    securityContact: {
      name: "Charlie Coder",
      email: "charlie.c@innovatesoft.co.uk",
    },
    description: "Develops cutting-edge CRM software.",
    complianceScopeTags: ["SOC2", "GDPR"],
  },
  {
    id: "org-vendor-1",
    name: "Secure Data Centers Inc.",
    type: "Critical Vendor",
    address: {
      street: "100 Server Farm Rd",
      city: "Ashburn",
      state: "VA",
      zip: "20147",
      country: "USA",
    },
    securityContact: {
      name: "Diana Datasafe",
      email: "diana.d@securedc.com",
    },
    description: "Provides Tier IV data center hosting services.",
    complianceScopeTags: ["SOC2", "ISO27001", "PCI-DSS"],
  },
];

// --- Zod Schema for Form Validation ---
const organizationSchema = z.object({
  name: z.string().min(2, { message: "Organization name must be at least 2 characters." }),
  type: z.enum(organizationTypes, { required_error: "Organization type is required." }),
  parentId: z.string().optional(), // Add logic later to show only if type is Subsidiary
  corporateId: z.string().optional(),
  street: z.string().min(3, { message: "Street address is required." }),
  city: z.string().min(2, { message: "City is required." }),
  state: z.string().optional(),
  zip: z.string().min(3, { message: "ZIP/Postal code is required." }),
  country: z.string().min(2, { message: "Country is required." }),
  securityContactName: z.string().min(2, { message: "Security contact name is required." }),
  securityContactEmail: z.string().email({ message: "Invalid email address." }),
  legalContactName: z.string().optional(),
  legalContactEmail: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
  description: z.string().optional(),
  complianceScopeTags: z.array(z.enum(complianceScopes)).min(1, { message: "Select at least one compliance scope." }),
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

// --- Requirements Placeholder ---
// In a real app, this would come from your requirements data
const mockRequirements = [
  { id: 'req-001', name: 'Access Control Policy', scope: ['SOC2', 'ISO27001'], status: 'Fulfilled' as RequirementStatus },
  { id: 'req-002', name: 'Data Encryption Standard', scope: ['SOC2', 'PCI-DSS', 'GDPR'], status: 'In Progress' as RequirementStatus },
  { id: 'req-003', name: 'Incident Response Plan', scope: ['SOC2', 'ISO27001'], status: 'Not Fulfilled' as RequirementStatus },
  { id: 'req-004', name: 'Vendor Security Assessment', scope: ['SOC2'], status: 'Partially Fulfilled' as RequirementStatus },
  { id: 'req-005', name: 'Employee Background Checks', scope: ['ISO27001'], status: 'Not Applicable' as RequirementStatus },
];

const RequirementStatusIcon = ({ status }: { status: RequirementStatus }) => {
  switch (status) {
    case 'Fulfilled': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'Not Fulfilled': return <XCircle className="h-4 w-4 text-red-500" />;
    case 'Partially Fulfilled': return <MinusCircle className="h-4 w-4 text-yellow-500" />;
    case 'In Progress': return <Clock className="h-4 w-4 text-blue-500" />;
    case 'Not Applicable': return <Info className="h-4 w-4 text-gray-500" />;
    default: return null;
  }
};

// --- Main Component ---
const Organizations: React.FC = () => {
  const [organizations, setOrganizations] = useState<Organization[]>(mockOrganizations);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [isRegisterSheetOpen, setIsRegisterSheetOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "",
      type: undefined,
      parentId: "",
      corporateId: "",
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
      securityContactName: "",
      securityContactEmail: "",
      legalContactName: "",
      legalContactEmail: "",
      description: "",
      complianceScopeTags: [],
    },
  });

  const onSubmit = (data: OrganizationFormData) => {
    console.log("Form Data:", data);
    // TODO: Replace with actual API call to save the organization
    const newOrg: Organization = {
      id: `org-${Date.now()}`, // Simple unique ID for mock
      name: data.name,
      type: data.type,
      parentId: data.type === 'Subsidiary' ? data.parentId : undefined,
      corporateId: data.corporateId,
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country,
      },
      securityContact: {
        name: data.securityContactName,
        email: data.securityContactEmail,
      },
      legalContact: data.legalContactName && data.legalContactEmail ? {
        name: data.legalContactName,
        email: data.legalContactEmail,
      } : undefined,
      description: data.description,
      complianceScopeTags: data.complianceScopeTags,
    };
    setOrganizations(prev => [...prev, newOrg]);
    toast({ title: "Organization Registered", description: `${data.name} has been added.` });
    form.reset();
    setIsRegisterSheetOpen(false);
  };

  const handleViewDetails = (org: Organization) => {
    setSelectedOrganization(org);
    setIsDetailsDialogOpen(true);
  };

  const handleRequirementStatusChange = (reqId: string, newStatus: RequirementStatus) => {
    console.log(`Requirement ${reqId} status changed to ${newStatus} for org ${selectedOrganization?.id}`);
    // TODO: Implement logic to save this status change, likely per organization-requirement pair
    toast({ title: "Status Updated", description: `Requirement status set to ${newStatus}.` });
  };

  // Filter requirements applicable to the selected organization
  const applicableRequirements = selectedOrganization
    ? mockRequirements.filter(req => 
        req.scope.some(scopeTag => selectedOrganization.complianceScopeTags.includes(scopeTag))
      )
    : [];

  const parentOrganizations = organizations.filter(org => org.type === 'Parent');
  const selectedOrgType = form.watch("type"); // Watch the type field for conditional rendering

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Organizations Management</h1>
          <p className="text-muted-foreground">
            Manage your company structure, vendors, and their compliance scopes.
          </p>
        </div>
        <Sheet open={isRegisterSheetOpen} onOpenChange={setIsRegisterSheetOpen}>
          <SheetTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Register New Organization
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-2xl">
            <ScrollArea className="h-full pr-6">
              <SheetHeader>
                <SheetTitle>Register New Organization</SheetTitle>
                <SheetDescription>
                  Fill in the details for the new organization. Click save when done.
                </SheetDescription>
              </SheetHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                  {/* Basic Info */}
                  <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name <span className="text-red-500">*</span></FormLabel>
                        <FormControl><Input placeholder="Global Tech Solutions" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem> )}/>
                  <FormField control={form.control} name="type" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Type <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select type..." /></SelectTrigger></FormControl>
                          <SelectContent>
                            {organizationTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem> )}/>
                  
                  {selectedOrgType === 'Subsidiary' && (
                    <FormField control={form.control} name="parentId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Organization <span className="text-red-500">*</span></FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select parent company..." /></SelectTrigger></FormControl>
                          <SelectContent>
                            {parentOrganizations.length > 0 ? (
                              parentOrganizations.map(parent => <SelectItem key={parent.id} value={parent.id}>{parent.name}</SelectItem>)
                            ) : (
                              <div className="p-4 text-sm text-muted-foreground">No parent companies registered yet.</div>
                            )}
                          </SelectContent>
                        </Select>
                         <FormDescription>Select the parent company this organization belongs to.</FormDescription>
                        <FormMessage />
                      </FormItem> )}/>
                  )}

                  <FormField control={form.control} name="corporateId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Corporate ID / DUNS Number</FormLabel>
                        <FormControl><Input placeholder="e.g., 123456789" {...field} /></FormControl>
                        <FormDescription>Optional, but helpful for identification.</FormDescription>
                        <FormMessage />
                      </FormItem> )}/>

                  {/* Address */}
                  <h3 className="text-lg font-semibold border-t pt-4">Address</h3>
                  <FormField control={form.control} name="street" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address <span className="text-red-500">*</span></FormLabel>
                        <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem> )}/>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem>
                          <FormLabel>City <span className="text-red-500">*</span></FormLabel>
                          <FormControl><Input placeholder="Metropolis" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem> )}/>
                    <FormField control={form.control} name="state" render={({ field }) => (
                        <FormItem>
                          <FormLabel>State / Province</FormLabel>
                          <FormControl><Input placeholder="CA" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem> )}/>
                    <FormField control={form.control} name="zip" render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP / Postal Code <span className="text-red-500">*</span></FormLabel>
                          <FormControl><Input placeholder="90210" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem> )}/>
                  </div>
                   <FormField control={form.control} name="country" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country <span className="text-red-500">*</span></FormLabel>
                          <FormControl><Input placeholder="USA" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem> )}/>

                  {/* Contacts */}
                  <h3 className="text-lg font-semibold border-t pt-4">Key Contacts</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="securityContactName" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Security Contact Name <span className="text-red-500">*</span></FormLabel>
                            <FormControl><Input placeholder="Alice Secure" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem> )}/>
                      <FormField control={form.control} name="securityContactEmail" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Security Contact Email <span className="text-red-500">*</span></FormLabel>
                            <FormControl><Input type="email" placeholder="security@example.com" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem> )}/>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="legalContactName" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Legal Contact Name</FormLabel>
                            <FormControl><Input placeholder="Bob Lawful" {...field} /></FormControl>
                             <FormDescription>Optional</FormDescription>
                            <FormMessage />
                          </FormItem> )}/>
                      <FormField control={form.control} name="legalContactEmail" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Legal Contact Email</FormLabel>
                            <FormControl><Input type="email" placeholder="legal@example.com" {...field} /></FormControl>
                             <FormDescription>Optional</FormDescription>
                            <FormMessage />
                          </FormItem> )}/>
                   </div>

                  {/* Other Info */}
                  <h3 className="text-lg font-semibold border-t pt-4">Additional Information</h3>
                   <FormField control={form.control} name="description" render={({ field }) => (
                       <FormItem>
                         <FormLabel>Description / Relationship</FormLabel>
                         <FormControl><Textarea placeholder="e.g., Provides critical cloud hosting services..." {...field} /></FormControl>
                         <FormDescription>Briefly describe the organization or its relationship.</FormDescription>
                         <FormMessage />
                       </FormItem> )}/>
                   <FormField control={form.control} name="complianceScopeTags" render={({ field }) => (
                       <FormItem>
                         <FormLabel>Compliance Scope Tags <span className="text-red-500">*</span></FormLabel>
                         <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {complianceScopes.map((scope: ComplianceScope) => (
                            <FormField
                              key={scope}
                              control={form.control}
                              name="complianceScopeTags"
                              render={({ field }) => {
                                return (
                                  <FormItem key={scope} className="flex flex-row items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <input
                                        type="checkbox"
                                        className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
                                        checked={field.value?.includes(scope as ComplianceScope)}
                                        onChange={(e) => {
                                          const currentScopes: ComplianceScope[] = field.value || [];
                                          let newScopes: ComplianceScope[];
                                          if (e.target.checked) {
                                            // Add if not already present
                                            newScopes = currentScopes.includes(scope as ComplianceScope) 
                                              ? currentScopes 
                                              : [...currentScopes, scope as ComplianceScope];
                                          } else {
                                            // Remove the scope
                                            newScopes = currentScopes.filter(s => s !== scope);
                                          }
                                          field.onChange(newScopes); // Pass the correctly typed array
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">{scope}</FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                         </div>
                         <FormDescription>Select all applicable compliance frameworks/regulations.</FormDescription>
                         <FormMessage />
                       </FormItem> )}/>

                  <SheetFooter className="mt-6">
                     <SheetClose asChild>
                       <Button type="button" variant="outline">Cancel</Button>
                     </SheetClose>
                    <Button type="submit" disabled={form.formState.isSubmitting}>Save Organization</Button>
                  </SheetFooter>
                </form>
              </Form>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Organizations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Organizations</CardTitle>
          <CardDescription>List of all parent companies, subsidiaries, and vendors.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="hidden md:table-cell">Security Contact</TableHead>
                <TableHead>Compliance Scope</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations.length > 0 ? (
                organizations.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell>{org.type}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {org.securityContact.name}<br/>{org.securityContact.email}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {org.complianceScopeTags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog open={selectedOrganization?.id === org.id && isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
                        <DialogTrigger asChild>
                           <Button variant="ghost" size="icon" onClick={() => handleViewDetails(org)} title="View Details">
                             <Eye className="h-4 w-4" />
                           </Button>
                        </DialogTrigger>
                        {/* Keep Edit/Delete outside DialogTrigger if they are separate actions */} 
                      </Dialog>
                      <Button variant="ghost" size="icon" disabled title="Edit (Not Implemented)"> <Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" disabled title="Delete (Not Implemented)" className="text-red-500 hover:text-red-600"> <Trash2 className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No organizations registered yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
         {selectedOrganization && (
           <DialogContent className="max-w-3xl">
            <ScrollArea className="max-h-[80vh]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5"/> {selectedOrganization.name}
                </DialogTitle>
                <DialogDescription>{selectedOrganization.type} Organization Details</DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 px-1">
                {/* Column 1: Details */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader><CardTitle className="text-lg">Basic Information</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p><strong>Type:</strong> {selectedOrganization.type}</p>
                      {selectedOrganization.parentId && (
                        <p><strong>Parent:</strong> {organizations.find(o => o.id === selectedOrganization.parentId)?.name || 'Unknown'}</p>
                      )}
                      {selectedOrganization.corporateId && (
                        <p><strong>Corp ID:</strong> {selectedOrganization.corporateId}</p>
                      )}
                      {selectedOrganization.description && (
                        <p><strong>Description:</strong> {selectedOrganization.description}</p>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="text-lg">Address</CardTitle></CardHeader>
                    <CardContent className="space-y-1 text-sm">
                        <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground"/> 
                           {selectedOrganization.address.street}, {selectedOrganization.address.city},
                           {selectedOrganization.address.state && ` ${selectedOrganization.address.state},`}
                           {` ${selectedOrganization.address.zip}`}, {selectedOrganization.address.country}
                        </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="text-lg">Contacts</CardTitle></CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p className="font-medium">Security Contact:</p>
                      <p className="flex items-center gap-2 ml-2"><User className="h-4 w-4 text-muted-foreground"/> {selectedOrganization.securityContact.name}</p>
                      <p className="flex items-center gap-2 ml-2"><Mail className="h-4 w-4 text-muted-foreground"/> {selectedOrganization.securityContact.email}</p>
                      {selectedOrganization.legalContact && (
                        <>
                          <p className="font-medium pt-2">Legal Contact:</p>
                          <p className="flex items-center gap-2 ml-2"><User className="h-4 w-4 text-muted-foreground"/> {selectedOrganization.legalContact.name}</p>
                          <p className="flex items-center gap-2 ml-2"><Mail className="h-4 w-4 text-muted-foreground"/> {selectedOrganization.legalContact.email}</p>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Column 2: Compliance */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader><CardTitle className="text-lg">Compliance Scope</CardTitle></CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {selectedOrganization.complianceScopeTags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                         <ListChecks className="h-5 w-5"/> Applicable Requirements
                      </CardTitle>
                      <CardDescription>Status of requirements based on compliance scope.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {applicableRequirements.length > 0 ? (
                         <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Requirement</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {applicableRequirements.map(req => (
                              <TableRow key={req.id}>
                                <TableCell className="text-sm">{req.name}</TableCell>
                                <TableCell>
                                  <Select 
                                     defaultValue={req.status} // Assuming mock data holds current status
                                     onValueChange={(value) => handleRequirementStatusChange(req.id, value as RequirementStatus)}>
                                    <SelectTrigger className="h-8 text-xs w-[150px]">
                                      <div className="flex items-center gap-1">
                                        <RequirementStatusIcon status={req.status}/>
                                        <SelectValue placeholder="Set status..." />
                                      </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                      {requirementStatuses.map(status => (
                                        <SelectItem key={status} value={status} className="text-xs">
                                          <div className="flex items-center gap-2">
                                            <RequirementStatusIcon status={status}/>
                                            {status}
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No applicable requirements found based on the selected compliance scopes.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>

              <DialogFooter className="mt-4 pr-1">
                <DialogClose asChild>
                  <Button type="button" variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
             </ScrollArea>
            </DialogContent>
          )} 
       </Dialog>
    </div>
  );
};

export default Organizations; 