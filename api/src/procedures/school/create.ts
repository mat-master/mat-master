import { Snowflake } from '@mat-master/common'
import { addressRowSchema } from '@mat-master/database'
import { z } from 'zod'
import { Procedure } from '..'
import { generateSnowflake } from '../../util/generate-snowflake'
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
	useAuthentication(ctx)
	if (!ctx.payload.emailVerified)
		throw 'You need to verify your email before you can create a school'

	const schoolId = generateSnowflake()
	const [account, subscription] = await Promise.all([
		ctx.stripe.accounts.create({
			type: 'standard',
			country: 'US',
			business_type: 'company',
			email: ctx.payload.email,
			company: {
				address: {
					country: 'US',
					state: address.state,
					city: address.city,
					line1: address.line1,
					line2: address.line2 ?? undefined,
					postal_code: address.postalCode,
				},
			},
			metadata: {
				id: schoolId.toString(),
			},
		}),
		ctx.stripe.subscriptions.create({
			customer: ctx.payload.stripeCustomerId!,
			items: [{ price: 'price_1KW88vGsHxGKM7KBG946ldmZ' }],
			trial_end: Math.floor(Date.now() / 1000 + 7890000),
			metadata: { id: schoolId.toString() },
		}),
	])

	return await ctx.db.school.create({
		data: {
			id: schoolId,
			name,
			stripeAccountId: account.id,
			stripeSubscriptionId: subscription.id,
			owner: { connect: { id: ctx.payload.id } },
			address: { create: address },
		},
		select: { id: true },
	})
}
