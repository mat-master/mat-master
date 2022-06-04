import { stripe } from '..'
import { Snowflake } from '../models'
import { Context } from '../procedures'
import { privateErrors } from './private-errors'

export const getMembershipPrice = async (
	ctx: Context,
	_membership: Snowflake | { stripeProductId: string }
) => {
	const membership =
		typeof _membership === 'bigint'
			? await privateErrors(() =>
					ctx.db.membership.findUnique({
						where: { id: _membership },
						select: { stripeProductId: true },
					})
			  )
			: _membership
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
