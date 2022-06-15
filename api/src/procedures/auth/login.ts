import { TRPCError } from '@trpc/server'
import { compare } from 'bcryptjs'
import { z } from 'zod'
import { Procedure } from '..'
import { Payload } from '../../models/payload'
import { signPayload } from '../../util/payload-encoding'

export const authLoginParamsSchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

export type AuthLoginParams = z.infer<typeof authLoginParamsSchema>
export interface AuthLoginResult {
	jwt: string
}

export const login: Procedure<AuthLoginParams, AuthLoginResult> = async ({
	ctx,
	input: { email, password },
}) => {
	const user = await ctx.db.user.findUnique({
		where: { email },
		select: {
			id: true,
			emailVerified: true,
			password: true,
			stripeCustomerId: true,
			schools: { select: { id: true } },
			students: { select: { id: true } },
		},
	})

	if (!user)
		throw new TRPCError({
			code: 'NOT_FOUND',
			message: 'incorrect email',
		})

	const matches = await compare(password, user.password)
	if (!matches)
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'incorrect password',
		})

	const payload: Payload = {
		id: user.id,
		email,
		emailVerified: user.emailVerified,
		schools: user.schools.map(({ id }) => id),
		students: user.students.map(({ id }) => id),
		stripeCustomerId: user.stripeCustomerId,
	}

	return { jwt: signPayload(payload) }
}
