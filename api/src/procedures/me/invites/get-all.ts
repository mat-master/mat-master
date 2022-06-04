import { Invite } from '@prisma/client'
import { Procedure } from '../..'
import { privateErrors } from '../../../util/private-errors'
import { useAuthentication } from '../../../util/use-authentication'

export type GetAllMeInvitesResult = Invite[]

export const getAllMeInvites: Procedure<void, GetAllMeInvitesResult> = async ({
	ctx,
}) => {
	const payload = useAuthentication(ctx)
	return await privateErrors(() =>
		ctx.db.invite.findMany({ where: { email: payload.email } })
	)
}
