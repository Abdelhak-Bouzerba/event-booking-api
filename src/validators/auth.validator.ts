import { z } from "zod";


// Define the schema for user registration validation
export const registerUserSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    role: z.enum(["organizer", "attendee"], "Role must be either 'organizer' or 'attendee'"),
});
export type RegisterUserSchemaType = z.infer<typeof registerUserSchema>;


//Define the schema for user login validation
export const loginUserSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
});
export type LoginUserSchemaType = z.infer<typeof loginUserSchema>;