import { snowflakeSchema } from '@mat-master/api'
import { z } from 'zod'
import { addressSchema } from './address'

export enum Tier {
	Trial,
	Basic,
	Premium,
}

export const schoolSchema = z.object({
	id: snowflakeSchema,
	owner: snowflakeSchema,
	name: z.string(),
	address: addressSchema,
	tier: z.nativeEnum(Tier),
	stripeAccountId: z.string(),
	stripeSubscriptionId: z.string(),
})
