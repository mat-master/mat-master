import { Invite } from '@prisma/client'
import { z } from 'zod'
import { Procedure } from '../..'
import {
	paginationParamsSchema,
	prismaPagination,
} from '../../../util/prisma-pagination'
import { privateErrors } from '../../../util/private-errors'
import { useAuthentication } from '../../../util/use-authentication'

export const getAllMeInvitesParamsSchema = paginationParamsSchema

export type GetAllMeInvitesParams = z.infer<typeof getAllMeInvitesParamsSchema>
export type GetAllMeInvitesResult = Invite[]

export const getAllMeInvites: Procedure<
	GetAllMeInvitesParams,
	GetAllMeInvitesResult
> = async ({ ctx, input: { pagination } }) => {
	const payload = useAuthentication(ctx)
	return await privateErrors(() =>
		ctx.db.invite.findMany({
			where: { email: payload.email },
			...prismaPagination(pagination),
		})
	)
}
