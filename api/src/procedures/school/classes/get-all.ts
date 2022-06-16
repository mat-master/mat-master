import { Class, ClassTime } from '@prisma/client'
import { z } from 'zod'
import { Procedure } from '../..'
import { Snowflake, snowflakeSchema } from '../../../models'
import {
	paginationParamsSchema,
	prismaPagination,
} from '../../../util/prisma-pagination'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const getAllSchoolClassesParamsSchema = z
	.object({ schoolId: snowflakeSchema })
	.merge(paginationParamsSchema)

export type GetAllSchoolClassesParams = z.infer<
	typeof getAllSchoolClassesParamsSchema
>
export type GetAllSchoolClassesResult = (Class & {
	memberships: Snowflake[]
	schedule: ClassTime[]
})[]

export const getAllSchoolClasses: Procedure<
	GetAllSchoolClassesParams,
	GetAllSchoolClassesResult
> = async ({ ctx, input: { schoolId, pagination } }) => {
	useSchoolAuthentication(ctx, schoolId)
	const now = new Date()
	const classes = await ctx.db.class.findMany({
		where: { schoolId },
		include: {
			memberships: { select: { id: true } },
			schedule: {
				where: {
					scheduleStart: { lte: now },
					scheduleEnd: { gte: now },
				},
			},
		},
		...prismaPagination(pagination),
	})

	return classes.map((_class) => ({
		..._class,
		memberships: _class.memberships.map(({ id }) => id),
	}))
}
