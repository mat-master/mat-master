import { TRPCError } from '@trpc/server'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { Procedure } from '..'
import { Payload, Snowflake, verificationPayloadSchema } from '../../models'

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
	let userId: Snowflake
	try {
		const payload = verificationPayloadSchema.parse(
			jwt.verify(token, ctx.env.JWT_SECRET)
		)
		userId = payload.id
	} catch (err) {
		if (err instanceof jwt.TokenExpiredError)
			throw new TRPCError({
				code: 'UNAUTHORIZED',
				message: 'verification token expired',
				cause: err,
			})

		throw undefined
	}

	const user = await ctx.db.user.findUnique({
		where: { id: userId },
		include: {
			schools: { select: { id: true } },
			students: { select: { id: true } },
		},
		rejectOnNotFound: true,
	})

	const stripeCustomer = await ctx.stripe.customers.create({
		name: `${user.firstName} ${user.lastName}`,
		email: user.email,
		metadata: { id: user.id.toString() },
	})

	await ctx.db.user.update({
		where: { id: user.id },
		data: {
			emailVerified: true,
			stripeCustomerId: stripeCustomer.id,
		},
	})

	const payload: Payload = {
		id: user.id,
		email: user.email,
		emailVerified: true,
		stripeCustomerId: stripeCustomer.id,
		schools: user.schools.map(({ id }) => id),
		students: user.students.map(({ id }) => id),
	}

	return { jwt: jwt.sign(payload, ctx.env.JWT_SECRET) }
}
