import { snowflakeSchema } from '@mat-master/common'
import { z } from 'zod'

export const verificationPayloadSchema = z.object({
	id: snowflakeSchema,
})

export type VerificationPayload = z.infer<typeof verificationPayloadSchema>
