import { snowflakeSchema } from '@mat-master/common'
import { z } from 'zod'
import { privilegeSchema } from './privilege'

export const userSchem = z.object({
	id: snowflakeSchema,
	firstName: z.string(),
	lastName: z.string(),
	email: z.string().email(),
	privilege: privilegeSchema,
	phone: z.string().nullable(),
	avatar: snowflakeSchema.nullable(),
})

export type User = z.infer<typeof userSchem>
