import { Procedure } from '..'
import { db } from '../..'
import { privateErrors } from '../../util/private-errors'
import { sendVerificationEmail } from '../../util/send-verification-email'
import { useAuthentication } from '../../util/use-authentication'

export const reSendVerificationEmail: Procedure = async ({ ctx }) => {
	const payload = useAuthentication(ctx)
	if (payload.emailVerified) throw 'Already verified'

	const user = await privateErrors(() =>
		db.user.findUnique({
			where: { id: payload.id },
			select: { firstName: true, lastName: true },
			rejectOnNotFound: true,
		})
	)

	await privateErrors(() =>
		sendVerificationEmail(
			payload.id,
			payload.email,
			`${user.firstName} ${user.lastName}`
		)
	)
}
