"use client";

import { Navbar } from "@/components/home/navbar";
import SelectCompany from "@/components/select/company";
import SelectInstitute from "@/components/select/institute";
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
import { useParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
    institutionAdmin: SelectInstitute,
    companyRepresentative: SelectCompany,
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
