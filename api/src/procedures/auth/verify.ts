import * as jwt from 'jsonwebtoken'
import { z } from 'zod'
import { Procedure } from '..'
import { db, stripe } from '../..'
import { Payload, payloadSchema } from '../../models'

export const authVerifyParamsSchema = z.object({
	token: z.string(),
})

export type AuthVerifyParams = z.infer<typeof authVerifyParamsSchema>
export interface AuthVerifyResult {
	jwt?: string
}

export const verify: Procedure<AuthVerifyParams, AuthVerifyResult> = async ({
	input: { token },
}) => {
	let payload: Payload
	try {
		payload = payloadSchema.parse(
			jwt.verify(token, process.env.JWT_SECRET as string)
		)
	} catch (err) {
		if (err instanceof jwt.TokenExpiredError)
			return { error: 'Verification token expired' }
		if (err instanceof z.ZodError) return { error: 'Invalid verification token' }
		return { error: 'an unknown error ocurred' }
	}

	const user = await db.user.findUnique({ where: { id: payload.id } })
	if (!user) return { error: 'Invalid verification token' }
	if (user.privilege === 'Verified') return { data: {} }

	const stripeCustomer = await stripe.customers.create({
		name: `${user.firstName} ${user.lastName}`,
		email: user.email,
		metadata: { id: user.id.toString() },
	})

	await db.user.update({
		where: { id: user.id },
		data: { privilege: 'Verified', stripeCustomerId: stripeCustomer.id },
	})

	const newPayload: Payload = {
		id: user.id,
		email: user.email,
		privilege: 'Verified',
		stripeCustomerId: stripeCustomer.id,
	}

	return { data: { jwt: jwt.sign(newPayload, process.env.JWT_SECRET as string) } }
}
