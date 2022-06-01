import { Invite } from '@prisma/client'
import { Procedure } from '../..'
import { db } from '../../..'

export type UserInvitesGetResult = Invite[]

export const getUserInvites: Procedure<void, UserInvitesGetResult> = async ({
	ctx: { payload },
}) => {
	if (!payload) throw 'Missing or invalid authorization header'
	return await db.invite.findMany({ where: { email: payload.email } })
}
