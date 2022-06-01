import { hash } from 'bcryptjs'
import { z } from 'zod'
import { Procedure } from '..'
import { db } from '../..'
import { Snowflake } from '../../models/snowflake'
import { generateSnowflake } from '../../util/generate-snowflake'
import { sendVerificationEmail } from '../../util/send-verification-email'

export const authSignupParamsSchema = z.object({
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	email: z.string().email(),
	password: z.string().min(6),
})

export type AuthSignupParams = z.infer<typeof authSignupParamsSchema>
export interface AuthSignupResult {
	id: Snowflake
}

export const signup: Procedure<AuthSignupParams, AuthSignupResult> = async ({
	input: { firstName, lastName, email, password },
}) => {
	const userExists = !!(await db.user.findUnique({ where: { email } }))
	if (userExists) throw 'Account already registered with email'

	const hashedPassword = await hash(password, 5)
	const id = generateSnowflake()
	if (!id) throw 'An unknown error ocurred'

	await db.user.create({
		data: {
			id,
			firstName,
			lastName,
			email,
			password: hashedPassword,
		},
	})

	await sendVerificationEmail(id, email, firstName, lastName)
	return { id }
}
