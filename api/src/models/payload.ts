import { z } from 'zod'
import { privilegeSchema } from './privilege'
import { snowflakeSchema } from './snowflake'

export const payloadSchema = z.object({
	id: snowflakeSchema,
	email: z.string().email(),
	privilege: privilegeSchema,
	stripeCustomerId: z.string().nullable(),
})

export type Payload = z.infer<typeof payloadSchema>
