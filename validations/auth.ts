import * as yup from "yup";

export const signUpSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
});

export type SignUpFormData = yup.InferType<typeof signUpSchema>;

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;

export const verifyEmailSchema = yup.object({
  token: yup.string().required("Verification token is missing"),
});

export type VerifyEmailData = yup.InferType<typeof verifyEmailSchema>;
