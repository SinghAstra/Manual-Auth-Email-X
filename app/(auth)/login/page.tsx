// app/login/page.tsx
// This is the client-side login page component.
// It handles user input, client-side validation with Yup, and calls the loginUser Server Action.

"use client"; // Mark as a Client Component

import { loginUser } from "@/actions/auth"; // Import the Server Action
import { useToastContext } from "@/components/providers/toast"; // For displaying toast messages
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import { LoginFormData, loginSchema } from "@/lib/validations/auth";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For redirection after login
import React, { useState } from "react";
import * as yup from "yup";

export default function LoginPage() {
  // State to hold form data
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  // State to hold validation errors
  const [errors, setErrors] = useState<
    Partial<Record<keyof LoginFormData, string>>
  >({});

  // State for loading indicator during login
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Access the toast context for displaying messages
  const { setToastMessage } = useToastContext();
  const router = useRouter(); // Initialize router for redirection

  /**
   * Handles changes to input fields.
   * Updates formData state and clears any existing error for that field.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear error for this field when user starts editing
    if (errors[id as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  /**
   * Handles the form submission for login.
   * Performs client-side validation and calls the loginUser Server Action.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior

    setIsLoggingIn(true); // Set loading state
    setErrors({}); // Clear previous errors

    try {
      // Client-side validation using Yup
      await loginSchema.validate(formData, { abortEarly: false });

      // If validation passes, call the Server Action
      const result = await loginUser(formData);

      if (result.success) {
        setToastMessage(result.message, "success");
        router.push("/dashboard"); // Redirect to dashboard on successful login
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
        const newErrors: Partial<Record<keyof LoginFormData, string>> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path as keyof LoginFormData] = err.message;
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
      setIsLoggingIn(false); // Reset loading state
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
            <h1 className="text-3xl font-bold text-foreground">Sign In</h1>
            <p className="text-muted-foreground">
              Sign in to your {siteConfig.name} account
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
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
                autoComplete="current-password"
              />
              {errors.password && (
                <p className="text-sm text-destructive text-right">
                  {errors.password}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <div className="flex items-center gap-2">
                  <Loader className="w-3 h-3 animate-spin" /> Logging In...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline text-primary">
              Sign Up
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
