"use client";

import InstitutionRegistrationForm from "@/components/auth/institution-registration-form";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { registerInstitution } from "@/lib/actions/auth.actions";
import { institutionFormSchema } from "@/lib/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const InstitutionRegistrationPage = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const form = useForm<z.infer<typeof institutionFormSchema>>({
    resolver: zodResolver(institutionFormSchema),
    defaultValues: {
      institutionName: "abhay",
      type: "university",
      establishedYear: "2017",
      affiliationNumber: "2019199234",
      location: "new york",
      email: "abhay@gmail.com",
      phone: "6387661992",
      address: "Anand Nagar Civil Line Ballia",
      zipCode: "2770001",
      adminName: "abhay",
      adminEmail: "abhay@gmail.com",
      adminPassword: "Abhay@codeman123",
      confirmPassword: "Abhay@codeman123",
      termsAccepted: true,
      designation: "principal",
      affiliationCertificate: undefined,
      governmentRecognition: undefined,
      letterhead: undefined,
    },
    mode: "onChange",
  });

  const handleStepChange = async (newStep: number) => {
    console.log("In handleStepChange");
    const currentStepFields = {
      1: [
        "institutionName",
        "type",
        "establishedYear",
        "location",
        "affiliationNumber",
      ],
      2: ["email", "phone", "address", "zipCode"],
      3: [
        "adminName",
        "designation",
        "adminEmail",
        "adminPassword",
        "confirmPassword",
      ],
      4: ["termsAccepted"],
    };
    console.log("newStep is ", newStep);
    console.log("step is ", step);

    if (newStep > step) {
      const fieldsToValidate = currentStepFields[step] || [];
      const result = await form.trigger(fieldsToValidate);

      if (!result) {
        toast({
          title: "Validation Error",
          description: "Please complete all required fields correctly.",
          variant: "destructive",
        });
        return;
      }

      // Check if any of the fields have errors
      const hasErrors = fieldsToValidate.some(
        (field) => form.getFieldState(field).error
      );

      if (hasErrors) {
        toast({
          title: "Validation Error",
          description: "Please correct the errors before proceeding.",
          variant: "destructive",
        });
        return;
      }
    }

    setStep(newStep);
  };

  const onSubmit = async (values: z.infer<typeof institutionFormSchema>) => {
    try {
      console.log("In the onSubmit.");
      const result = await registerInstitution(values);

      if (result.success) {
        toast({
          title: "Registration Successful",
          description:
            result.message || "Please check your email to verify your account.",
        });
      } else {
        toast({
          title: "Registration Error",
          description:
            result.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log("error --InstitutionRegistrationPage is ", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Institution Registration</h1>
          <p className="text-muted-foreground">
            Step {step} of {totalSteps}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <InstitutionRegistrationForm
              form={form}
              currentStep={step}
              onStepChange={handleStepChange}
              onSubmit={onSubmit}
              totalSteps={totalSteps}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default InstitutionRegistrationPage;
