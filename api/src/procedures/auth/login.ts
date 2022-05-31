import { compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { z } from 'zod'
import { Procedure } from '..'
import { db } from '../..'
import { Payload } from '../../models/payload'

export const authLoginParamsSchema = z.object({
	email: z.string().email(),
	password: z.string(),
})

export type AuthLoginParams = z.infer<typeof authLoginParamsSchema>
export interface AuthLoginResult {
	jwt: string
}

export const login: Procedure<AuthLoginParams, AuthLoginResult> = async ({
	input: { email, password },
}) => {
	const user = await db.user.findUnique({ where: { email } })
	if (!user) return { error: 'incorrect email' }

	const matches = await compare(password, user.password)
	if (!matches) return { error: 'incorrect password' }

	const payload: Payload = {
		id: user.id,
		email: user.email,
		privilege: user.privilege,
		stripeCustomerId: user.stripeCustomerId,
	}

	return { data: { jwt: sign(payload, process.env.JWT_SECRET as string) } }
}
