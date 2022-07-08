import { snowflakeSchema } from '@mat-master/common'
import { z } from 'zod'

export const kioskPayloadSchema = z.object({
	id: snowflakeSchema,
	schoolId: snowflakeSchema,
})

export type KioskPayload = z.infer<typeof kioskPayloadSchema>
