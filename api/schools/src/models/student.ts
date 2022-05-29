import { snowflakeSchema } from '@mat-master/api'
import { z } from 'zod'

export const studentSchema = z.object({
	id: snowflakeSchema,
	user: z.never(), // TODO: add user schema
	memberships: z.array(snowflakeSchema),
	stripeCustomerId: z.string(),
})

export type Student = z.infer<typeof studentSchema>
