import { Snowflake } from '../models'
import { Context } from '../procedures'
import { privateErrors } from './private-errors'

export async function getMembershipPrice(
	ctx: Context,
	membership: Snowflake | { stripeProductId: string }
) {
	const { stripeProductId } =
		typeof membership === 'bigint'
			? await privateErrors(() =>
					ctx.db.membership.findUnique({
						where: { id: membership },
						select: { stripeProductId: true },
						rejectOnNotFound: true,
					})
			  )
			: membership

	return await privateErrors(async () => {
		const res = await ctx.stripe.prices.list({
			active: true,
			product: stripeProductId,
			type: 'recurring',
			limit: 100,
		})

		const prices = res.data.sort((a, b) => a.created - b.created)
		return prices[0]
	})
}
