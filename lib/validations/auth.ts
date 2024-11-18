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
  // Company Details
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(2, "Industry is required"),
  companyType: z.enum([
    "public",
    "private",
    "partnership",
    "startup",
    "government",
  ]),
  companySize: z.enum(["1-50", "51-200", "201-500", "500+"]),
  establishedYear: z.string().refine((year) => {
    const numYear = parseInt(year);
    return numYear >= 1800 && numYear <= currentYear;
  }, `Year must be between 1800 and ${currentYear}`),
  registrationNumber: z
    .string()
    .min(5, "Please enter a valid registration number"),
  gstNumber: z.string().min(5, "Please enter a valid GST number"),
  companyDescription: z
    .string()
    .max(500, "Description must not exceed 500 characters"),

  // Contact Information
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  website: z.string().url("Invalid website URL"),
  address: z.object({
    street: z.string().min(5, "Street address is required"),
    city: z.string().min(2, "City is required"),
    state: z.string().min(2, "State is required"),
    country: z.string().min(2, "Country is required"),
    zipCode: z.string().min(5, "Please enter a valid postal code"),
  }),

  // HR Contact
  hrContact: z.object({
    name: z.string().min(2, "Name is required"),
    designation: z.string().min(2, "Designation is required"),
    department: z.enum(["hr", "recruitment", "talent"]),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    linkedin: z.string().url("Invalid LinkedIn URL").optional(),
  }),

  // Admin Details
  adminDetails: z
    .object({
      name: z.string().min(2, "Name is required"),
      designation: z.string().min(2, "Designation is required"),
      email: z.string().email("Invalid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must contain uppercase, lowercase, number, and special character"
        ),
      confirmPassword: z.string(),
      phone: z.string().min(10, "Phone number must be at least 10 digits"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),

  // Documents
  registrationCertificate: z.any().optional(),
  taxDocument: z.any().optional(),
  companyProfile: z.any().optional(),

  // Terms
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean().default(false),
});
