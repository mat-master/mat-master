import { Class } from '@prisma/client'
import { z } from 'zod'
import { Procedure } from '../..'
import { snowflakeSchema } from '../../../models'
import {
	paginationParamsSchema,
	prismaPagination,
} from '../../../util/prisma-pagination'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const getAllSchoolClassesParamsSchema = z
	.object({
		schoolId: snowflakeSchema,
	})
	.merge(paginationParamsSchema)

export type GetAllSchoolClassesParams = z.infer<
	typeof getAllSchoolClassesParamsSchema
>
export type GetAllSchoolClassesResult = Class[]

export const getAllSchoolClasses: Procedure<
	GetAllSchoolClassesParams,
	GetAllSchoolClassesResult
> = async ({ ctx, input: { schoolId, pagination } }) => {
	useSchoolAuthentication(ctx, schoolId)
	return await ctx.db.class.findMany({
		where: { schoolId },
		...prismaPagination(pagination),
	})
}
