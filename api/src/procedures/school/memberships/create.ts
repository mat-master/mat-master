import { z } from 'zod'
import { Procedure } from '../..'
import { Snowflake, snowflakeSchema } from '../../../models'
import { generateSnowflake } from '../../../util/generate-snowflake'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const createSchoolMembershipParamsSchema = z.object({
	schoolId: snowflakeSchema,
	name: z.string(),
	price: z.number().int(),
	interval: z.enum(['day', 'month', 'week', 'year']),
	intervalCount: z.number().int(),
	classes: z.array(snowflakeSchema),
})

export type CreateSchoolMembershipParams = z.infer<
	typeof createSchoolMembershipParamsSchema
>
export interface CreateSchoolMembershipResult {
	id: Snowflake
}

export const createSchoolMembership: Procedure<
	CreateSchoolMembershipParams,
	CreateSchoolMembershipResult
> = async ({ ctx, input: { schoolId, ...data } }) => {
	useSchoolAuthentication(ctx, schoolId)
	const school = await ctx.db.school.findUnique({
		where: { id: schoolId },
		select: { stripeAccountId: true },
		rejectOnNotFound: true,
	})

	const product = await ctx.stripe.products.create(
		{ name: `${data.name} Membership` },
		{ stripeAccount: school.stripeAccountId }
	)

	const [classes] = await Promise.all([
		ctx.db.class.findMany({
			where: { id: { in: data.classes }, schoolId },
			select: { id: true },
		}),
		ctx.stripe.prices.create(
			{
				product: product.id,
				currency: 'USD',
				unit_amount: data.price,
				recurring: {
					interval: data.interval,
					interval_count: data.intervalCount,
				},
			},
			{ stripeAccount: school.stripeAccountId }
		),
	])

	if (classes.length !== data.classes.length) throw 'One or more classes not found'

	return await ctx.db.membership.create({
		data: {
			id: generateSnowflake(),
			name: data.name,
			school: { connect: { id: schoolId } },
			classes: { connect: classes },
			stripeProductId: product.id,
		},
		select: { id: true },
	})
}
