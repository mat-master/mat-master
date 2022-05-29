import { z } from 'zod'

export const addressSchema = z.object({
	city: z.string(),
	state: z.string().length(2),
	postalCode: z.string().regex(/^\d{5}$/),
	line1: z.string(),
	line2: z.string().nullable(),
})

export type Address = z.infer<typeof addressSchema>
