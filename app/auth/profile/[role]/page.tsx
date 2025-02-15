"use client";

import { Navbar } from "@/components/home/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
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
import { zodResolver } from "@hookform/resolvers/zod";
import { DocumentType } from "@prisma/client";
import { X } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

enum InstitutionAdminDocumentsType {
  INSTITUTION_ID = "INSTITUTION_ID",
  AUTHORIZATION_LETTER = "AUTHORIZATION_LETTER",
}

interface DocumentFile {
  file: File | null;
  preview: string | null;
}

type InstitutionAdminDocumentsFiles = {
  [key in InstitutionAdminDocumentsType]?: DocumentFile;
};

const InstitutionAdminForm = () => {
  const fileInputRefs = useRef<
    Record<InstitutionAdminDocumentsType, HTMLInputElement | null>
  >({
    [InstitutionAdminDocumentsType.INSTITUTION_ID]: null,
    [InstitutionAdminDocumentsType.AUTHORIZATION_LETTER]: null,
  });

  const [documents, setDocuments] = useState<InstitutionAdminDocumentsFiles>({
    [DocumentType.INSTITUTION_ID]: { file: null, preview: null },
    [DocumentType.AUTHORIZATION_LETTER]: { file: null, preview: null },
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: InstitutionAdminDocumentsType
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setDocuments((prev) => ({
        ...prev,
        [type]: {
          file,
          preview: previewUrl,
        },
      }));
    }
  };

  const removeDocument = (type: InstitutionAdminDocumentsType) => {
    const currentPreview = documents[type]?.preview;
    if (currentPreview) {
      URL.revokeObjectURL(currentPreview);
    }

    setDocuments((prev) => ({
      ...prev,
      [type]: {
        file: null,
        preview: null,
      },
    }));

    if (fileInputRefs.current[type]) {
      fileInputRefs.current[type].value = "";
    }
  };

  const formSchema = z.object({
    name: z.string().min(2).max(50),
    type: z.string().min(2),
    address: z.string().min(10),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().length(6),
    website: z.string().url().optional(),
    phone: z.string().min(10),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      website: "",
      phone: "",
    },
  });

  const formatDocumentType = (type: string): string => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <div className="w-full max-w-xl border rounded-md py-2 px-4">
      <div className="mb-4">
        <h2 className="text-2xl">Institution Administrator Profile</h2>
        <span className="text-sm text-muted-foreground">
          Provide details about your educational institution
        </span>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm transition-colors font-normal">
                  Institution Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter institution name" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm transition-colors font-normal">
                  Institution Type
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select institution type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="university">University</SelectItem>
                    <SelectItem value="college">College</SelectItem>
                    <SelectItem value="institute">
                      Technical Institute
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm transition-colors font-normal">
                  Address
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter complete address" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm transition-colors font-normal">
                    City
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm transition-colors font-normal">
                    State
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter state" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm transition-colors font-normal">
                    Pincode
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter 6-digit pincode" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm transition-colors font-normal">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm transition-colors font-normal">
                  Website (Optional)
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter institution website" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {Object.values(InstitutionAdminDocumentsType).map((type) => (
            <div key={type}>
              <FormLabel className="text-sm transition-colors font-normal">
                {formatDocumentType(type)}
              </FormLabel>
              <div className="mt-2">
                <Input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, type)}
                  className="w-full cursor-pointer"
                  ref={(el) => (fileInputRefs.current[type] = el)}
                />
              </div>
              {documents[type]?.preview && (
                <div className="mt-2 relative">
                  <div className="relative w-full h-40 border rounded-md overflow-hidden">
                    {documents[type]?.file?.type.startsWith("image/") ? (
                      <Image
                        src={documents[type]?.preview}
                        alt={`${type} Preview`}
                        width={320}
                        height={160}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <p className="text-sm text-muted-foreground">
                          PDF Document
                        </p>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        removeDocument(type as InstitutionAdminDocumentsType)
                      }
                      className="absolute top-2 right-2 p-1 bg-background rounded-full shadow-md hover:bg-accent transition-colors"
                    >
                      <X className="h-4 w-4 text-foreground" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

const CompanyRepresentativeForm = () => {
  const formSchema = z.object({
    companyName: z.string().min(2),
    industry: z.string(),
    designation: z.string(),
    department: z.string().optional(),
    website: z.string().url().optional(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string().length(6),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      industry: "",
      designation: "",
      department: "",
      website: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Company Representative Profile</CardTitle>
        <CardDescription>Provide your company and role details</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
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
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const StudentForm = () => {
  const formSchema = z.object({
    enrollmentNo: z.string(),
    institutionId: z.string(),
    courseId: z.string(),
    graduationYear: z.number().min(2024).max(2030),
    cgpa: z.number().min(0).max(10).optional(),
    skills: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enrollmentNo: "",
      institutionId: "",
      courseId: "",
      graduationYear: 2024,
      cgpa: undefined,
      skills: "",
    },
  });

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Student Profile</CardTitle>
        <CardDescription>Complete your academic profile</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="enrollmentNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enrollment Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="graduationYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Graduation Year</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cgpa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CGPA</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const GovernmentForm = () => {
  const formSchema = z.object({
    department: z.string(),
    designation: z.string(),
    jurisdiction: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      department: "",
      designation: "",
      jurisdiction: "",
    },
  });

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Government Official Profile</CardTitle>
        <CardDescription>
          Enter your department and jurisdiction details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jurisdiction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jurisdiction</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select jurisdiction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="national">National</SelectItem>
                      <SelectItem value="state">State</SelectItem>
                      <SelectItem value="district">District</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const ProfileRolePage = () => {
  const params = useParams();
  const role = params.role as string;
  const roleArray = role.split("-");
  const parsedRoleArray = roleArray.map((role, index) => {
    if (index === 0) {
      return role;
    }
    return role.charAt(0).toUpperCase() + role.substring(1);
  });
  const parsedRole = parsedRoleArray.join("");
  console.log("parsedRole is ", parsedRole);

  const roleComponents: Record<string, React.FC> = {
    institutionAdmin: InstitutionAdminForm,
    companyRepresentative: CompanyRepresentativeForm,
    student: StudentForm,
    government: GovernmentForm,
  };
  if (!roleComponents[parsedRole]) {
    return <div>Invalid role</div>;
  }
  const FormComponent = roleComponents[parsedRole];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <FormComponent />
      </div>
    </div>
  );
};

export default ProfileRolePage;
