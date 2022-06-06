import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { Procedure } from '..'
import { db } from '../..'
import { Payload } from '../../models/payload'
import { privateErrors } from '../../util/private-errors'

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
	const user = await privateErrors(() =>
		db.user.findUnique({
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
	)
	if (!user) throw 'incorrect email'

	const matches = await privateErrors(() => compare(password, user.password))
	if (!matches) throw 'incorrect password'

	const payload: Payload = {
		id: user.id,
		email,
		emailVerified: user.emailVerified,
		schools: user.schools.map(({ id }) => id),
		students: user.students.map(({ id }) => id),
		stripeCustomerId: user.stripeCustomerId,
	}

	return { jwt: jwt.sign(payload, ctx.env.JWT_SECRET) }
}
