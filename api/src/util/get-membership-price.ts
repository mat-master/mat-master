import { stripe } from '..'
import { Snowflake } from '../models'
import { Context } from '../procedures'
import { privateErrors } from './private-errors'

export const getMembershipPrice = async (ctx: Context, id: Snowflake) => {
	const membership = await privateErrors(() =>
		ctx.db.membership.findUnique({
			where: { id },
			select: { stripeProductId: true },
		})
	)
	if (!membership) throw 'Membership not found'

	return await privateErrors(async () => {
		const res = await stripe.prices.list({
			active: true,
			product: membership.stripeProductId,
			type: 'recurring',
			limit: 100,
		})

		const prices = res.data.sort((a, b) => a.created - b.created)
		return prices[0]
	})
}
