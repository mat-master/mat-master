import { z } from 'zod'
import { Procedure } from '../..'
import { snowflakeSchema } from '../../../models'
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
	const [membership, school] = await Promise.all([
		ctx.db.membership.findFirst({
			where: { id, schoolId },
			select: { stripeProductId: true },
		}),
		ctx.db.school.findUnique({
			where: { id: schoolId },
			select: { stripeAccountId: true },
			rejectOnNotFound: true,
		}),
	])

	if (!membership) throw 'Membership not found'
	let price = await getMembershipPrice(ctx, membership)
	if (data.price || data.interval || data.intervalCount) {
		price = await ctx.stripe.prices.create(
			{
				product: membership.stripeProductId,
				currency: 'USD',
				unit_amount: data.price ?? price.unit_amount!,
				recurring: {
					interval: data.interval ?? price.recurring!.interval,
					interval_count: data.intervalCount ?? price.recurring!.interval_count,
				},
			},
			{ stripeAccount: school.stripeAccountId }
		)
	}

	await ctx.db.membership.update({
		where: { id },
		data: {
			name: data.name,
			stripeProductId: price.id,
			classes: data.classes
				? { connect: data.classes?.map((id) => ({ id })) }
				: undefined,
		},
	})
}
