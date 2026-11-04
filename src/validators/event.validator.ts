import { z } from "zod";


//Define the schema for event creation
export const createEventSchema = z.object({
    organizerId: z.number().int().positive(),
    title: z.string().min(7),
    description: z.string().min(20),
    venue: z.string().min(5),
    capacity: z.number().int().positive(),
    startsAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }),
});
export type CreateEventSchemaType = z.infer<typeof createEventSchema>;


//Define the schema for event update
export const updateEventSchema = z.object({
    title: z.string().min(7).optional(),
    description: z.string().min(20).optional(),
    venue: z.string().min(5).optional(),
    capacity: z.number().int().positive().optional(),
    startsAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
    }).optional(),
});
export type UpdateEventSchemaType = z.infer<typeof updateEventSchema>;