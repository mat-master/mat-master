import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { Procedure } from '..'
import { db, stripe } from '../..'
import { Payload } from '../../models'
import { verificationPayloadSchema } from '../../models/verification-payload'
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
	const payload = await privateErrors(() => {
		try {
			return verificationPayloadSchema.parse(jwt.verify(token, ctx.env.JWT_SECRET))
		} catch (err) {
			if (err instanceof jwt.TokenExpiredError) throw 'Verification token expired'
			if (err instanceof z.ZodError) throw 'Invalid verification token'
			throw 'An unknown error ocurred'
		}
	})

	const user = await privateErrors(() =>
		db.user.findUnique({
			where: { id: payload.id },
			include: {
				schools: { select: { id: true } },
				students: { select: { id: true } },
			},
		})
	)
	if (!user) throw 'Invalid verification token'

	const stripeCustomer = await privateErrors(() =>
		stripe.customers.create({
			name: `${user.firstName} ${user.lastName}`,
			email: user.email,
			metadata: { id: payload.id.toString() },
		})
	)

	await privateErrors(() =>
		db.user.update({
			where: { id: payload.id },
			data: {
				emailVerified: true,
				stripeCustomerId: stripeCustomer.id,
			},
		})
	)

	const newPayload: Payload = {
		id: payload.id,
		email: user.email,
		emailVerified: true,
		stripeCustomerId: stripeCustomer.id,
		schools: user.schools.map(({ id }) => id),
		students: user.students.map(({ id }) => id),
	}

	return { jwt: jwt.sign(newPayload, ctx.env.JWT_SECRET) }
}
