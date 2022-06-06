import { z } from 'zod'
import { snowflakeSchema } from './snowflake'

export const verificationPayloadSchema = z.object({
	id: snowflakeSchema,
})

export type VerificationPayload = z.infer<typeof verificationPayloadSchema>
