"use client";

import { Navbar } from "@/components/home/navbar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSpinner } from "react-icons/fa6";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  website: z.string().url(),
});

const CreateCompany = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [message, setMessage] = useState<string>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      website: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        setMessage("Failed to create company");
        return;
      }

      setMessage("Company created successfully");
      router.push(`/auth/profile-setup`);
    } catch (error) {
      if (error instanceof Error) {
        console.log("error.stack is ", error.stack);
        console.log("error.message is ", error.message);
      }
      setMessage("Internal Server Error.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!message) return;
    toast({
      title: message,
    });
  }, [message, toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="w-full max-w-xl border rounded-md py-2 px-4 mt-4 mx-auto">
        <div className="mb-4">
          <h2 className="text-2xl">Company Profile</h2>
          <span className="text-sm text-muted-foreground">
            Provide details about your company
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
                    Company Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter company name" {...field} />
                  </FormControl>
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
                    <Input placeholder="Enter company address" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

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
                    State/Province
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter state or province" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm transition-colors font-normal">
                    Website (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" /> Creating...
                </>
              ) : (
                "Create Company"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateCompany;
