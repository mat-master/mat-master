import { z } from 'zod'
import { snowflakeSchema } from './snowflake'

export const kioskPayloadSchema = z.object({
	id: snowflakeSchema,
	schoolId: snowflakeSchema,
})

export type KioskPayload = z.infer<typeof kioskPayloadSchema>
