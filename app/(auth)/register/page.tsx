"use client";

import { registerUser } from "@/actions/auth";
import { useToastContext } from "@/components/providers/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import { SignUpFormData, signUpSchema } from "@/validations/auth";
import { Loader } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import * as yup from "yup";

function RegisterPage() {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpFormData, string>>
  >({});

  const [isRegistering, setIsRegistering] = useState(false);

  const { setToastMessage } = useToastContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear error for this field when user starts editing
    if (errors[id as keyof SignUpFormData]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 

    setIsRegistering(true); 
    setErrors({}); 

    try {
      await signUpSchema.validate(formData, { abortEarly: false });

      const result = await registerUser(formData);

      if (result.success) {
        setToastMessage(result.message);
        // Optionally clear form or redirect after successful registration
        setFormData({ name: "", email: "", password: "" }); // Clear form
        // router.push('/login'); // Could redirect to login page
      } else {
        // Handle server-side validation errors or other messages
        if (result.errors) {
          setErrors(result.errors); // Set specific field errors
        }
        setToastMessage(result.message, "error"); // Display general error message
      }
    } catch (error) {
      // Handle Yup validation errors
      if (error instanceof yup.ValidationError) {
        const newErrors: Partial<Record<keyof SignUpFormData, string>> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path as keyof SignUpFormData] = err.message;
          }
        });
        setErrors(newErrors); // Set validation errors
        setToastMessage("Please correct the errors in the form.", "error");
      } else if (error instanceof Error) {
        // Handle other unexpected client-side errors
        setToastMessage(error.message, "error");
      } else {
        setToastMessage("An unexpected error occurred.", "error");
      }
    } finally {
      setIsRegistering(false); // Reset loading state
    }
  };

  return (
    <div className="w-full flex min-h-screen p-4">
      <div className="p-8 space-y-6 flex-1 flex flex-col items-center justify-center relative">
        <Link href="/">
          <div className="flex items-center space-x-2 mb-16 md:mb-0 md:absolute md:top-0 md:left-0">
            <Loader className="h-6 w-6 text-primary" />{" "}
            {/* Placeholder for a logo */}
            <span className="text-lg font-semibold text-foreground">
              {siteConfig.name}
            </span>
          </div>
        </Link>
        <div className="max-w-xl w-full space-y-6 flex flex-col ">
          <div className="space-y-2 w-full">
            <h1 className="text-3xl font-bold text-foreground">Sign up</h1>
            <p className="text-muted-foreground">
              Sign up to enjoy the features of {siteConfig.name}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Jonas Khanwald"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-destructive" : ""}
                autoComplete="name"
              />
              {errors.name && (
                <p className="text-sm text-destructive text-right">
                  {errors.name}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jonas_kahnwald@example.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-destructive" : ""}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-sm text-destructive text-right">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "border-destructive" : ""}
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-sm text-destructive text-right">
                  {errors.password}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isRegistering}>
              {isRegistering ? (
                <div className="flex items-center gap-2">
                  <Loader className="w-3 h-3 animate-spin" /> Registering...
                </div>
              ) : (
                "Register"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="underline text-primary">
              Sign In
            </Link>
          </div>
        </div>
      </div>
      {/* Placeholder for an image on larger screens */}
      <div className="hidden md:flex relative flex-1">
        <img
          src="/placeholder.svg?height=800&width=800"
          alt="Abstract background"
          className="object-cover w-full h-full rounded-xl"
        />
      </div>
    </div>
  );
}

export default RegisterPage;
