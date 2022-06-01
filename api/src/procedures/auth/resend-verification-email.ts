import { Procedure } from '..'
import { db } from '../..'
import { sendVerificationEmail } from '../../util/send-verification-email'
import { useAuthentication } from '../../util/use-authentication'

export const reSendVerificationEmail: Procedure = async ({ ctx }) => {
	const payload = useAuthentication(ctx)
	if (payload.privilege === 'Verified') throw 'Already verified'

	const user = await db.user.findUnique({ where: { id: payload.id } })
	if (!user) throw 'Not Found'
	await sendVerificationEmail(payload.id, payload.email, '', '')
}
