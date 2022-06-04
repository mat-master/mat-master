import { z } from 'zod'
import { Procedure } from '../..'
import { stripe } from '../../..'
import { Snowflake, snowflakeSchema } from '../../../models'
import { generateSnowflake } from '../../../util/generate-snowflake'
import { privateErrors } from '../../../util/private-errors'
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
	const { school } = await useSchoolAuthentication(ctx, schoolId)
	return await privateErrors(async () => {
		const product = await stripe.products.create(
			{ name: `${data.name} Membership` },
			{ stripeAccount: school.stripeAccountId }
		)

		await stripe.prices.create(
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
		)

		const classes = await Promise.all(
			data.classes.map((id) => ctx.db.class.findUnique({ where: { id } }))
		)

		if (!classes.every((_class) => _class?.schoolId === schoolId))
			throw 'Class not found'

		return await ctx.db.membership.create({
			data: {
				...data,
				id: generateSnowflake(),
				school: { connect: { id: schoolId } },
				classes: { connect: data.classes.map((id) => ({ id })) },
				stripeProductId: product.id,
			},
			select: { id: true },
		})
	})
}
