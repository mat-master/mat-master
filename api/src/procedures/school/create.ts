import { addressRowSchema } from '@mat-master/database'
import { z } from 'zod'
import { Procedure } from '..'
import { db, stripe } from '../..'
import { Snowflake } from '../../models'
import { generateSnowflake } from '../../util/generate-snowflake'
import { privateErrors } from '../../util/private-errors'
import { useAuthentication } from '../../util/use-authentication'

export const createSchoolParamsSchema = z.object({
	name: z.string().min(1),
	address: addressRowSchema.omit({ id: true, schoolId: true }),
})

export type CreateSchoolParams = z.infer<typeof createSchoolParamsSchema>
export type CreateSchoolResult = { id: Snowflake }

export const createSchool: Procedure<
	CreateSchoolParams,
	CreateSchoolResult
> = async ({ ctx, input: { name, address } }) => {
	const payload = useAuthentication(ctx)
	if (!payload.emailVerified)
		throw 'You need to verify your email before you can create a school'

	const schoolId = generateSnowflake()
	const [account, subscription] = await privateErrors(() =>
		Promise.all([
			stripe.accounts.create({
				type: 'standard',
				country: 'US',
				business_type: 'company',
				email: payload.email,
				company: {
					address: {
						country: 'US',
						...address,
						postal_code: address.postalCode,
						line2: address.line2 ?? undefined,
					},
				},
				metadata: {
					id: schoolId.toString(),
				},
			}),
			stripe.subscriptions.create({
				customer: payload.stripeCustomerId!,
				items: [{ price: 'price_1KW88vGsHxGKM7KBG946ldmZ' }],
				trial_end: Math.floor(Date.now() / 1000 + 7890000),
				metadata: { id: schoolId.toString() },
			}),
		])
	)

	await privateErrors(() =>
		db.school.create({
			data: {
				id: schoolId,
				name,
				stripeAccountId: account.id,
				stripeSubscriptionId: subscription.id,
				owner: { connect: { id: payload.id } },
				address: { create: { id: generateSnowflake(), ...address } },
			},
		})
	)

	return { id: schoolId }
}
