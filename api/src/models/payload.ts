import { snowflakeSchema } from '@mat-master/common'
import { z } from 'zod'

export const payloadSchema = z.object({
	id: snowflakeSchema,
	email: z.string().email(),
	emailVerified: z.boolean(),
	schools: z.array(snowflakeSchema),
	students: z.array(snowflakeSchema),
	stripeCustomerId: z.string().nullable(),
})

export type Payload = z.infer<typeof payloadSchema>
