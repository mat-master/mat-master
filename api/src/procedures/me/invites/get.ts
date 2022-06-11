import { Invite } from '@prisma/client'
import { Procedure } from '../..'
import { privateErrors } from '../../../util/private-errors'
import { useAuthentication } from '../../../util/use-authentication'

export type UserInvitesGetResult = Invite[]

export const getUserInvites: Procedure<void, UserInvitesGetResult> = async ({
	ctx,
}) => {
	const payload = useAuthentication(ctx.payload)
	return await privateErrors(() =>
		ctx.db.invite.findMany({ where: { email: payload.email } })
	)
}
