import { Invite } from '@prisma/client'
import { Procedure } from '..'
import { useAuthentication } from '../../util/use-authentication'

export type GetUserInvitesResult = Invite[]

export const getUserInvites: Procedure<void, GetUserInvitesResult> = async ({
	ctx,
}) => {
	useAuthentication(ctx)
	return await ctx.db.invite.findMany({ where: { email: ctx.payload.email } })
}
