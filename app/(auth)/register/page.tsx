"use client";

import { registerUser } from "@/actions/auth";
import { useToastContext } from "@/components/providers/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { siteConfig } from "@/config/site";
import { SignUpFormData, signUpSchema } from "@/validations/auth";
import { Eye, EyeOff, Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import * as yup from "yup";

function RegisterPage() {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
  });
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof SignUpFormData, string>>
  >({});
  const [isRegistering, setIsRegistering] = useState(false);
  const { setToastMessage } = useToastContext();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    // Clear error for this field when user starts editing
    if (errors[id as keyof SignUpFormData]) {
      setErrors((prev) => ({ ...prev, [id]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsRegistering(true);
    setErrors({});

    try {
      await signUpSchema.validate(formData, { abortEarly: false });

      const result = await registerUser(formData);

      if (result.success) {
        setToastMessage(result.message);
        setFormData({ name: "", email: "", password: "" });
      } else {
        setToastMessage(result.message);
      }
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors: Partial<Record<keyof SignUpFormData, string>> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path as keyof SignUpFormData] = err.message;
          }
        });
        setErrors(newErrors);
        setToastMessage("Please correct the errors in the form.");
      } else if (error instanceof Error) {
        setToastMessage(error.message);
      } else {
        setToastMessage("An unexpected error occurred.");
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="w-full flex min-h-screen p-4">
      <div className="p-8 space-y-6 flex-1 flex flex-col items-center justify-center relative">
        <Link href="/">
          <div className="flex items-center space-x-2 mb-16 md:mb-0 md:absolute md:top-0 md:left-0">
            <Loader className="h-6 w-6 text-primary" />{" "}
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
                placeholder="Enter Your Name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-destructive" : ""}
                autoComplete="off"
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
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-destructive" : ""}
                autoComplete="off"
              />
              {errors.email && (
                <p className="text-sm text-destructive text-right">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "border-destructive" : ""}
                  autoComplete="off"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 cursor-pointer bg-transparent hover:bg-transparent"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>

              {errors.password && (
                <p className="text-sm text-destructive text-right">
                  {errors.password}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full cursor-pointer mt-4"
              disabled={isRegistering}
            >
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
      <div className="hidden md:flex relative flex-1">
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-muted/40 border-muted-foreground rounded-xl" />
        )}
        <Image
          src="/assets/bg-auth.png"
          alt="Auth"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          onLoad={() => setIsImageLoaded(true)}
          className={`object-cover transition-opacity duration-700 ${
            isImageLoaded ? "opacity-100" : "opacity-0"
          }`}
          priority
        />
      </div>
    </div>
  );
}

export default RegisterPage;
