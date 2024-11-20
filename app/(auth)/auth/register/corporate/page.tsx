"use client";

import { CorporateRegistrationForm } from "@/components/auth/corporate-registration-form";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { registerCorporate } from "@/lib/actions/auth/register.corporate";
import { corporateFormSchema } from "@/lib/validations/corporateSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export default function CorporateRegistrationPage() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const stepFields = {
    1: [
      "companyName",
      "industry",
      "companyType",
      "companySize",
      "establishedYear",
      "registrationNumber",
      "gstNumber",
      "companyDescription",
    ],
    2: [
      "email",
      "phone",
      "website",
      "address.street",
      "address.city",
      "address.state",
      "address.country",
      "address.zipCode",
    ],
    3: [
      "hrContact.name",
      "hrContact.designation",
      "hrContact.department",
      "hrContact.email",
      "hrContact.phone",
    ],
    4: [
      "adminDetails.name",
      "adminDetails.designation",
      "adminDetails.email",
      "adminDetails.password",
      "adminDetails.confirmPassword",
      "adminDetails.phone",
    ],
    5: ["termsAccepted"],
  } as const;

  type StepFields = typeof stepFields;

  const handleStepChange = async (newStep: number) => {
    if (newStep < step) {
      setStep(newStep);
      return;
    }

    // Validate current step fields before proceeding
    const fieldsToValidate = stepFields[step as keyof StepFields] || [];
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      if (newStep === totalSteps + 1) {
        await onSubmit(form.getValues());
      } else {
        setStep(newStep);
      }
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
    }
  };

  async function onSubmit(values: z.infer<typeof corporateFormSchema>) {
    try {
      const response = await registerCorporate(values);

      if (!response.success) {
        toast({
          title: "Registration Failed!",
          description: response.message,
        });
      } else {
        toast({
          title: "Registration Successful",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error) {
      console.log("error is ", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }

  const form = useForm<z.infer<typeof corporateFormSchema>>({
    resolver: zodResolver(corporateFormSchema),
    defaultValues: {
      companyName: "Company Name",
      industry: "Manufacturing",
      companyType: "public",
      companySize: "1-50",
      establishedYear: "2018",
      registrationNumber: "ABCDEFGIJ",
      gstNumber: "ABCDEFGHJIJ",
      email: "abhay@gmail.com",
      phone: "1223456789",
      website: "http://localhost:3000/auth/register/corporate",
      address: {
        street: "street",
        city: "city",
        state: "state",
        country: "India",
        zipCode: "288801",
      },
      hrContact: {
        name: "HR",
        designation: "HR",
        department: "hr",
        email: "contact@hr.com",
        phone: "1234567890",
        linkedin: "",
      },
      adminDetails: {
        name: "Admin Name",
        designation: "Sdmin Designation",
        email: "admin@gmail.com",
        password: "Abhay@password123",
        confirmPassword: "Abhay@password123",
        phone: "1234567889",
      },
      companyDescription: "",
      registrationCertificate: undefined,
      taxDocument: undefined,
      companyProfile: undefined,
      termsAccepted: false,
    },
    mode: "onChange",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Corporate Registration</h1>
          <p className="text-muted-foreground">
            Step {step} of {totalSteps}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <CorporateRegistrationForm
              form={form}
              currentStep={step}
              totalSteps={totalSteps}
              onStepChange={handleStepChange}
            />
          </form>
        </Form>
      </div>
    </div>
  );
}
