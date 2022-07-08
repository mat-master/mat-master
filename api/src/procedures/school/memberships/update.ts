import { snowflakeSchema } from '@mat-master/common'
import { z } from 'zod'
import { Procedure } from '../..'
import { getMembershipPrice } from '../../../util/get-membership-price'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const updateSchoolMembershipParamsSchema = z.object({
	id: snowflakeSchema,
	schoolId: snowflakeSchema,

	name: z.string().optional(),
	price: z.number().int().optional(),
	interval: z.enum(['day', 'month', 'week', 'year']).optional(),
	intervalCount: z.number().int().optional(),
	classes: z.array(snowflakeSchema).optional(),
})

export type UpdateSchoolMembershipParams = z.infer<
	typeof updateSchoolMembershipParamsSchema
>

export const updateSchoolMembership: Procedure<
	UpdateSchoolMembershipParams
> = async ({ ctx, input: { id, schoolId, ...data } }) => {
	useSchoolAuthentication(ctx, schoolId)
	const [price, school] = await Promise.all([
		getMembershipPrice(ctx, id),
		ctx.db.school.findUnique({
			where: { id: schoolId },
			select: { stripeAccountId: true },
			rejectOnNotFound: true,
		}),
	])

	if (
		data.price !== price.unit_amount ||
		data.interval !== price.recurring?.interval ||
		data.intervalCount !== price.recurring?.interval_count
	) {
		const [_, newPrice] = await Promise.all([
			ctx.stripe.prices.update(price.id, { active: false }),
			ctx.stripe.prices.create(
				{
					product: price.product as string,
					currency: 'USD',
					unit_amount: data.price ?? price.unit_amount!,
					recurring: {
						interval: data.interval ?? price.recurring!.interval,
						interval_count: data.intervalCount ?? price.recurring!.interval_count,
					},
				},
				{ stripeAccount: school.stripeAccountId }
			),
		])

		await ctx.stripe.products.update(price.product as string, {
			default_price: newPrice.id,
		})
	}

	await ctx.db.membership.update({
		where: { id },
		data: {
			name: data.name,
			classes: data.classes
				? { createMany: { data: data.classes.map((classId) => ({ classId })) } }
				: undefined,
		},
	})
}
