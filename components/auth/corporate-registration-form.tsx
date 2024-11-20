"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { corporateFormSchema } from "@/lib/validations/corporateSchema";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  Info,
  Loader2,
  Phone,
  Shield,
  Upload,
  Users,
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import ProgressSteps from "./progress-steps";

const steps: FormStep[] = [
  { title: "Company", description: "Basic details" },
  { title: "Contact", description: "Contact info" },
  { title: "HR Contact", description: "HR details" },
  { title: "Admin", description: "Admin setup" },
  { title: "Documents", description: "Upload files" },
];

const industries: SelectOption[] = [
  { value: "it", label: "IT/Software" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "consulting", label: "Consulting" },
  { value: "finance", label: "Finance" },
  { value: "healthcare", label: "Healthcare" },
  { value: "edtech", label: "Education Technology" },
  { value: "other", label: "Others" },
];

const companyTypes: SelectOption[] = [
  { value: "public", label: "Public Limited" },
  { value: "private", label: "Private Limited" },
  { value: "partnership", label: "Partnership" },
  { value: "startup", label: "Startup" },
  { value: "government", label: "Government Enterprise" },
];

const companySizes: SelectOption[] = [
  { value: "1-50", label: "1-50 employees" },
  { value: "51-200", label: "51-200 employees" },
  { value: "201-500", label: "201-500 employees" },
  { value: "500+", label: "500+ employees" },
];

export type FormStep = {
  title: string;
  description: string;
};

export type CompanyDetails = {
  companyName: string;
  industry: string;
  companyType: string;
  companySize: string;
  establishedYear: string;
  registrationNumber: string;
  gstNumber: string;
  companyDescription: string;
};

export type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
};

export type ContactInformation = {
  email: string;
  phone: string;
  website: string;
  address: Address;
};

export type HRContact = {
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  linkedin?: string;
};

export type AdminDetails = {
  name: string;
  designation: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
};

export type DocumentUpload = {
  registrationCertificate: File | null;
  taxDocument: File | null;
  companyProfile: File | null;
  termsAccepted: boolean;
};

export type CorporateRegistrationFormProps = {
  form: UseFormReturn<z.infer<typeof corporateFormSchema>>;
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
};

export type SelectOption = {
  value: string;
  label: string;
};

export type FileChangeHandler = (
  e: React.ChangeEvent<HTMLInputElement>,
  fieldName: string
) => void;

export interface FormTooltipProps {
  content: string;
}

export interface FormStepProps {
  form: UseFormReturn<z.infer<typeof corporateFormSchema>>;
}

export function CorporateRegistrationForm({
  form,
  currentStep,
  totalSteps,
  onStepChange,
}: CorporateRegistrationFormProps) {
  const formSteps: Record<number, React.ReactNode> = {
    1: <CompanyDetails form={form} />,
    2: <ContactInformation form={form} />,
    3: <HRContact form={form} />,
    4: <AdminSetup form={form} />,
    5: <DocumentUpload form={form} />,
  };

  return (
    <div className="space-y-8">
      <ProgressSteps currentStep={currentStep} steps={steps} />

      <Card className="p-6 mt-16 bg-gray-900/60 border border-gray-800 backdrop-blur-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {formSteps[currentStep]}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onStepChange(currentStep - 1)}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          <Button
            type="button"
            onClick={() => {
              onStepChange(currentStep + 1);
            }}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Wait....
              </>
            ) : currentStep === totalSteps ? (
              "Submit"
            ) : (
              "Next"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}

function FormTooltip({ content }: FormTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-4 w-4 text-muted-foreground ml-2" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function CompanyDetails({ form }: FormStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Company Details
        </h2>
        <p className="text-sm text-muted-foreground">
          Please provide your company&apos;s basic information
        </p>
      </div>

      <FormField
        control={form.control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Company Name
              <FormTooltip content="Enter the full legal name of your company" />
            </FormLabel>
            <FormControl>
              <Input placeholder="Enter company name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry Sector</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.value} value={industry.value}>
                      {industry.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {companyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="companySize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Size</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {companySizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="establishedYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year of Establishment</FormLabel>
              <FormControl>
                <Input type="number" placeholder="YYYY" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="registrationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                Registration Number
                <FormTooltip content="Your company's registration/CIN number" />
              </FormLabel>
              <FormControl>
                <Input placeholder="e.g., U74999DL2023PTC123456" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gstNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GST Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter GST number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="companyDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Brief description of your company..."
                className="resize-none"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Provide a brief overview of your company (max 500 characters)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function ContactInformation({ form }: FormStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Phone className="h-5 w-5" />
          Contact Information
        </h2>
        <p className="text-sm text-muted-foreground">
          Provide official contact details for your company
        </p>
      </div>

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Corporate Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="contact@company.com"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Phone</FormLabel>
              <FormControl>
                <Input placeholder="+1 (555) 000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Website</FormLabel>
              <FormControl>
                <Input placeholder="https://www.company.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="address.street"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address</FormLabel>
            <FormControl>
              <Input placeholder="Enter street address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="address.city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Enter city" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address.state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input placeholder="Enter state" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="address.country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="Enter country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address.zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ZIP/Postal Code</FormLabel>
              <FormControl>
                <Input placeholder="Enter ZIP code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function HRContact({ form }: FormStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          HR Contact Details
        </h2>
        <p className="text-sm text-muted-foreground">
          Provide details of the primary HR contact person
        </p>
      </div>

      <FormField
        control={form.control}
        name="hrContact.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="hrContact.designation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Designation</FormLabel>
              <FormControl>
                <Input placeholder="e.g., HR Manager" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hrContact.department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Department</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="recruitment">Recruitment</SelectItem>
                  <SelectItem value="talent">Talent Acquisition</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="hrContact.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="hr@company.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="hrContact.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Direct Contact Number</FormLabel>
              <FormControl>
                <Input placeholder="+1 (555) 000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hrContact.linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn Profile</FormLabel>
              <FormControl>
                <Input placeholder="LinkedIn URL (Optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function AdminSetup({ form }: FormStepProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Admin Account Setup
        </h2>
        <p className="text-sm text-muted-foreground">
          Set up the primary administrator account
        </p>
      </div>

      <FormField
        control={form.control}
        name="adminDetails.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="adminDetails.designation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Designation</FormLabel>
            <FormControl>
              <Input placeholder="e.g., IT Manager" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="adminDetails.email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="admin@company.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="adminDetails.password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormDescription>Must be at least 8 characters</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="adminDetails.confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="adminDetails.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mobile Number</FormLabel>
            <FormControl>
              <Input placeholder="+1 (555) 000-0000" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function DocumentUpload({ form }: FormStepProps) {
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof DocumentUpload
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue(fieldName, file);
    }
  };
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Document Upload
        </h2>
        <p className="text-sm text-muted-foreground">
          Upload the required company documents
        </p>
      </div>

      <div className="grid gap-4">
        <FormField
          control={form.control}
          name="registrationCertificate"
          render={() => (
            <FormItem>
              <FormLabel>Company Registration Certificate</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) =>
                    handleFileChange(e, "registrationCertificate")
                  }
                />
              </FormControl>
              <FormDescription>
                Upload PDF or DOC format (max 5MB)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="taxDocument"
          render={() => (
            <FormItem>
              <FormLabel>GST/Tax Registration Document</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, "taxDocument")}
                />
              </FormControl>
              <FormDescription>
                Upload PDF or DOC format (max 5MB)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyProfile"
          render={() => (
            <FormItem>
              <FormLabel>Company Profile/Brochure</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange(e, "companyProfile")}
                />
              </FormControl>
              <FormDescription>
                Upload PDF or DOC format (max 5MB)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="termsAccepted"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>I accept the terms and conditions</FormLabel>
              <FormDescription>
                By checking this box, you agree to our Terms of Service and
                Privacy Policy.
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}
