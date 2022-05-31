import { Procedure } from '..'
import { db } from '../..'
import { sendVerificationEmail } from '../../util/send-verification-email'

export const reSendVerificationEmail: Procedure = async ({ ctx: { payload } }) => {
	if (!payload) throw 'Missing or invalid authorization header'
	if (payload.privilege === 'Verified') throw 'Already verified'

	const user = await db.user.findUnique({ where: { id: payload.id } })
	if (!user) throw 'Not Found'
	await sendVerificationEmail(payload.id, payload.email, '', '')
}
