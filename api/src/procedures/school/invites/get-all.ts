import { Invite } from '@prisma/client'
import { z } from 'zod'
import { Procedure } from '../..'
import { snowflakeSchema } from '../../../models'
import {
	paginationParamsSchema,
	prismaPagination,
} from '../../../util/prisma-pagination'
import { privateErrors } from '../../../util/private-errors'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const getAllSchoolInvitesParamsSchema = z
	.object({
		schoolId: snowflakeSchema,
	})
	.merge(paginationParamsSchema)

export type GetAllSchoolInvitesParams = z.infer<
	typeof getAllSchoolInvitesParamsSchema
>
export type GetAllSchoolInvitesResult = Invite[]

export const getSchoolInvites: Procedure<
	GetAllSchoolInvitesParams,
	GetAllSchoolInvitesResult
> = async ({ ctx, input: { schoolId, pagination } }) => {
	await useSchoolAuthentication(ctx, schoolId)
	return await privateErrors(() =>
		ctx.db.invite.findMany({
			where: { schoolId },
			...prismaPagination(pagination),
		})
	)
}
