import { Snowflake, snowflakeSchema } from '@mat-master/common'
import { Class, ClassTime } from '@prisma/client'
import { z } from 'zod'
import { Procedure } from '../..'
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
	const classes = await ctx.db.class.findMany({
		where: { schoolId },
		include: {
			memberships: { select: { membershipId: true } },
			schedule: true,
		},
		...prismaPagination(pagination),
	})

	return classes.map((_class) => ({
		..._class,
		memberships: _class.memberships.map(({ membershipId }) => membershipId),
	}))
}
