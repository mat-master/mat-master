import { TRPCError } from '@trpc/server'
import { Procedure } from '..'
import { VerificationPayload } from '../../models/verification-payload'
import { signPayload } from '../../util/payload-encoding'
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
	const verificationToken = signPayload(verificationPayload, {
		expiresIn: '15m',
	})

	await sendVerificationEmail(payload.email, verificationToken)
}
