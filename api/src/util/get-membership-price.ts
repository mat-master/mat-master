import Stripe from 'stripe'
import { defaultDb, stripe } from '..'
import { Snowflake } from '../models'
import { Context } from '../procedures'
import { privateErrors } from './private-errors'

export function getMembershipPrice(membership: Snowflake): Promise<Stripe.Price>
export function getMembershipPrice(membership: {
	stripeProductId: string
}): Promise<Stripe.Price>
export async function getMembershipPrice(
	membership: Snowflake | { stripeProductId: string },
	ctx?: Context
) {
	const db = ctx?.db ?? defaultDb
	const { stripeProductId } =
		typeof membership === 'bigint'
			? await privateErrors(() =>
					db.membership.findUnique({
						where: { id: membership },
						select: { stripeProductId: true },
						rejectOnNotFound: true,
					})
			  )
			: membership

	return await privateErrors(async () => {
		const res = await stripe.prices.list({
			active: true,
			product: stripeProductId,
			type: 'recurring',
			limit: 100,
		})

		const prices = res.data.sort((a, b) => a.created - b.created)
		return prices[0]
	})
}
