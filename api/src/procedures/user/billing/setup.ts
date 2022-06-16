import { Procedure } from '../..'
import { useAuthentication } from '../../../util/use-authentication'

export interface SetupUserBillingResult {
	secret: string
}

export const setupUserBilling: Procedure<void, SetupUserBillingResult> = async ({
	ctx,
}) => {
	useAuthentication(ctx)
	const intent = await ctx.stripe.setupIntents.create({
		customer: ctx.payload.stripeCustomerId!,
	})

	if (!intent.client_secret) throw undefined
	return { secret: intent.client_secret }
}
