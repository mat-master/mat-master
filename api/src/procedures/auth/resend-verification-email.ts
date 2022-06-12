import { TRPCError } from '@trpc/server'
import { sign } from 'jsonwebtoken'
import { Procedure } from '..'
import { VerificationPayload } from '../../models/verification-payload'
import { sendVerificationEmail } from '../../util/send-verification-email'
import { useAuthentication } from '../../util/use-authentication'

export const reSendVerificationEmail: Procedure = async ({ ctx }) => {
	const payload = useAuthentication(ctx.payload)
	if (payload.emailVerified)
		throw new TRPCError({
			code: 'FORBIDDEN',
			message: 'already verified',
		})

	const verificationPayload: VerificationPayload = { id: payload.id }
	const verificationToken = sign(verificationPayload, ctx.env.JWT_SECRET, {
		expiresIn: '15m',
	})

	await sendVerificationEmail(payload.email, verificationToken)
}
