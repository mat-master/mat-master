import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { Procedure } from '..'
import { db, stripe } from '../..'
import { Payload, payloadSchema } from '../../models'
import { privateErrors } from '../../util/private-errors'

export const authVerifyParamsSchema = z.object({
	token: z.string(),
})

export type AuthVerifyParams = z.infer<typeof authVerifyParamsSchema>
export type AuthVerifyResult = {
	jwt?: string
} | void

export const verify: Procedure<AuthVerifyParams, AuthVerifyResult> = async ({
	ctx,
	input: { token },
}) => {
	let payload: Payload
	try {
		payload = payloadSchema.parse(
			jwt.verify(token, process.env.JWT_SECRET as string)
		)
	} catch (err) {
		if (err instanceof jwt.TokenExpiredError) throw 'Verification token expired'
		if (err instanceof z.ZodError) throw 'Invalid verification token'
		throw 'An unknown error ocurred'
	}

	const user = await privateErrors(() =>
		db.user.findUnique({ where: { id: payload.id } })
	)
	if (!user) return { error: 'Invalid verification token' }
	if (user.emailVerified) return

	const stripeCustomer = await privateErrors(() =>
		stripe.customers.create({
			name: `${user.firstName} ${user.lastName}`,
			email: user.email,
			metadata: { id: user.id.toString() },
		})
	)

	await privateErrors(() =>
		db.user.update({
			where: { id: user.id },
			data: {
				emailVerified: true,
				stripeCustomerId: stripeCustomer.id,
			},
		})
	)

	const newPayload: Payload = {
		id: user.id,
		email: user.email,
		emailVerified: true,
		stripeCustomerId: stripeCustomer.id,
	}

	return { jwt: jwt.sign(newPayload, ctx.env.JWT_SECRET) }
}
