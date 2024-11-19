"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Building2, GraduationCap } from "lucide-react";
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Get Started</h1>
          <p className="text-muted-foreground">
            Choose your registration type to continue
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Link href="/auth/register/institution">
            <Card className="group relative overflow-hidden p-6 hover:border-primary transition-colors bg-gray-900/60 border border-gray-800 backdrop-blur-xl">
              <motion.div whileHover={{ scale: 1.02 }} className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Institution</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Register as an educational institution or university
                  </p>
                </div>
                <div
                  className={cn(
                    "absolute inset-0 pointer-events-none transition-opacity",
                    "bg-gradient-to-r from-primary/10 via-transparent to-transparent",
                    "opacity-0 group-hover:opacity-100"
                  )}
                />
              </motion.div>
            </Card>
          </Link>

          <Link href="/auth/register/corporate">
            <Card className="group relative overflow-hidden p-6 hover:border-primary transition-colors bg-gray-900/60 border border-gray-800 backdrop-blur-xl">
              <motion.div whileHover={{ scale: 1.02 }} className="space-y-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Corporate</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Register as a business organization or company
                  </p>
                </div>
                <div
                  className={cn(
                    "absolute inset-0 pointer-events-none transition-opacity",
                    "bg-gradient-to-r from-primary/10 via-transparent to-transparent",
                    "opacity-0 group-hover:opacity-100"
                  )}
                />
              </motion.div>
            </Card>
          </Link>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
