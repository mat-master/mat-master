import { Snowflake } from '../models'
import { Context } from '../procedures'

export const getMembershipPrice = async (
	ctx: Context,
	membership: Snowflake | { stripeProductId: string }
) => {
	const { stripeProductId } =
		typeof membership === 'bigint'
			? await ctx.db.membership.findUnique({
					where: { id: membership },
					select: { stripeProductId: true },
					rejectOnNotFound: true,
			  })
			: membership

	const res = await ctx.stripe.prices.list({
		active: true,
		product: stripeProductId,
		type: 'recurring',
		limit: 100,
	})

	return res.data.at(-1)!
}
