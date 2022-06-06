import { z } from 'zod'
import { snowflakeSchema } from './snowflake'

export const payloadSchema = z.object({
	id: snowflakeSchema,
	email: z.string().email(),
	emailVerified: z.boolean(),
	schools: z.array(snowflakeSchema),
	students: z.array(snowflakeSchema),
	stripeCustomerId: z.string().nullable(),
})

export type Payload = z.infer<typeof payloadSchema>
