"use client";

import InstitutionRegistrationForm from "@/components/auth/institution-registration-form";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
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
      institutionName: "",
      type: "university",
      establishedYear: "",
      location: "",
      email: "",
      phone: "",
      address: "",
      adminName: "",
      adminEmail: "",
      adminPassword: "",
      termsAccepted: false,
    },
  });

  async function onSubmit(values: z.infer<typeof institutionFormSchema>) {
    try {
      // Here you would typically make an API call to your backend
      console.log(values);
      toast({
        title: "Registration Successful",
        description: "Please check your email to verify your account.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }

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
              onStepChange={setStep}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default InstitutionRegistrationPage;
