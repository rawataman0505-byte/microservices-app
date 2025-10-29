// validators/authValidator.js
const { z } = require("zod");

const signupSchema = z.object({
  name: z
    .string({
      required_error: "name is required",
      invalid_type_error: "name must be a string",
    })
    .nonempty("name cannot be empty")
    .min(3, "name must be at least 3 characters")
    .max(50, "name cannot exceed 50 characters")
    .transform((val) => val.trim())
    .refine((val) => /^[A-Za-z0-9_-]+$/.test(val), {
      message:
        "name must contain only letters, numbers, hyphens, and underscores",
    }),

  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .nonempty("Email cannot be empty")
    .email("Invalid email format")
    .transform((val) => val.trim().toLowerCase()),

  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .nonempty("Password cannot be empty")
    .min(8, "Password must be at least 8 characters")
    .refine(
      (val) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/.test(
          val
        ),
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
      }
    ),
});

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email must be a string",
    })
    .nonempty("Email cannot be empty")
    .email("Invalid email format")
    .transform((val) => val.trim().toLowerCase()),

  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    })
    .nonempty("Password cannot be empty")
    .min(8, "Password must be at least 8 characters")
    .refine(
      (val) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/.test(
          val
        ),
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
      }
    ),
});

module.exports = { signupSchema, loginSchema };
