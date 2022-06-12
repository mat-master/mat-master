import { Invite } from '@prisma/client'
import { Procedure } from '..'
import { useAuthentication } from '../../util/use-authentication'

export type GetUserInvitesResult = Invite[]

export const getUserInvites: Procedure<void, GetUserInvitesResult> = async ({
	ctx,
}) => {
	const payload = useAuthentication(ctx.payload)
	return await ctx.db.invite.findMany({ where: { email: payload.email } })
}
