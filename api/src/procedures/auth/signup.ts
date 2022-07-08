import { Snowflake } from '@mat-master/common'
import { TRPCError } from '@trpc/server'
import { hash } from 'bcryptjs'
import { z } from 'zod'
import { Procedure } from '..'
import { VerificationPayload } from '../../models/verification-payload'
import { generateSnowflake } from '../../util/generate-snowflake'
import { signPayload } from '../../util/payload-encoding'
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
	ctx,
	input: { firstName, lastName, email, password },
}) => {
	const existingUser = await ctx.db.user.findUnique({
		where: { email },
		select: { id: true },
	})

	if (existingUser)
		throw new TRPCError({
			code: 'CONFLICT',
			message: "There's already an account registered with that email",
		})

	const user = await ctx.db.user.create({
		data: {
			id: generateSnowflake(),
			firstName,
			lastName,
			email,
			password: await hash(password, 5),
		},
	})

	const verificationPayload: VerificationPayload = { id: user.id }
	const verificationToken = signPayload(verificationPayload, { expiresIn: '15m' })

	await sendVerificationEmail(email, verificationToken)
	return { id: user.id }
}
