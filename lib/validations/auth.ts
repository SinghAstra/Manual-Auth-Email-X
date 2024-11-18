import * as z from "zod";

const currentYear = new Date().getFullYear();

export const institutionFormSchema = z
  .object({
    // Basic Details
    institutionName: z
      .string()
      .min(2, "Institution name must be at least 2 characters"),
    type: z.enum(["university", "college", "technical", "research"]),
    establishedYear: z.string().refine((year) => {
      const numYear = parseInt(year);
      return numYear >= 1800 && numYear <= currentYear;
    }, `Year must be between 1800 and ${currentYear}`),
    affiliationNumber: z
      .string()
      .min(5, "Please enter a valid affiliation number"),
    location: z.string().min(2, "Location is required"),

    // Contact Information
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    alternatePhone: z
      .string()
      .min(10, "Phone number must be at least 10 digits")
      .optional(),
    address: z.string().min(10, "Please provide a complete address"),
    zipCode: z.string().min(5, "Please enter a valid postal code"),

    // Admin Details
    adminName: z.string().min(2, "Admin name must be at least 2 characters"),
    designation: z.enum(["principal", "director", "registrar"]),
    adminEmail: z.string().email("Invalid email address"),
    adminPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain uppercase, lowercase, number, and special character"
      ),
    confirmPassword: z.string(),

    // Documents
    affiliationCertificate: z.any().optional(),
    governmentRecognition: z.any().optional(),
    letterhead: z.any().optional(),

    // Terms
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.adminPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const corporateFormSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(2, "Industry is required"),
  companySize: z.string().min(1, "Company size is required"),
  location: z.string().min(2, "Location is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  website: z.string().url("Invalid website URL"),
  registrationCertificate: z.any().optional(),
  taxDocument: z.any().optional(),
  companyProfile: z.any().optional(),
  adminName: z.string().min(2, "Admin name must be at least 2 characters"),
  adminEmail: z.string().email("Invalid email address"),
  adminPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain uppercase, lowercase, number, and special character"
    ),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});
