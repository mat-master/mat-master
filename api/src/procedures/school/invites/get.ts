import { Invite } from '@prisma/client'
import { z } from 'zod'
import { Procedure } from '../..'
import { snowflakeSchema } from '../../../models'
import {
	paginationParamsSchema,
	prismaPagination,
} from '../../../util/prisma-pagination'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const getSchoolInvitesParamsSchema = z
	.object({
		schoolId: snowflakeSchema,
	})
	.merge(paginationParamsSchema)

export type GetSchoolInvitesParams = z.infer<typeof getSchoolInvitesParamsSchema>
export type GetSchoolInvitesResult = Invite[]

export const getSchoolInvites: Procedure<
	GetSchoolInvitesParams,
	GetSchoolInvitesResult
> = async ({ ctx, input: { schoolId, pagination } }) => {
	useSchoolAuthentication(ctx, schoolId)
	return await ctx.db.invite.findMany({
		where: { schoolId },
		...prismaPagination(pagination),
	})
}
