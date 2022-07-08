import { Snowflake } from '@mat-master/common'
import Stripe from 'stripe'
import { Context } from '../procedures'

export function getMembershipPrice(
	ctx: Context,
	membership: Snowflake
): Promise<Stripe.Price>

export function getMembershipPrice(
	ctx: Context,
	membership: { stripeProductId: string },
	stripeAccount: string
): Promise<Stripe.Price>

export async function getMembershipPrice(
	ctx: Context,
	membership: Snowflake | { stripeProductId: string },
	stripeAccountId?: string
) {
	if (typeof membership === 'bigint') {
		const { school, stripeProductId } = await ctx.db.membership.findUnique({
			where: { id: membership },
			select: {
				stripeProductId: true,
				school: { select: { stripeAccountId: true } },
			},
			rejectOnNotFound: true,
		})

		membership = { stripeProductId }
		stripeAccountId ??= school.stripeAccountId
	} else if (!stripeAccountId) {
		throw new Error(
			'stripeAccountId is required when membership is passed as a literal value'
		)
	}

	const product = await ctx.stripe.products.retrieve(
		membership.stripeProductId,
		{ expand: ['default_price'] },
		{ stripeAccount: stripeAccountId }
	)

	let price = product.default_price
	if (typeof price === 'string') price = await ctx.stripe.prices.retrieve(price)
	if (!price) throw "Membership doesn't have a default price"
	return price
}
