import { z } from 'zod'
import { Procedure } from '../..'
import { Snowflake, snowflakeSchema } from '../../../models'
import {
	paginationParamsSchema,
	prismaPagination,
} from '../../../util/prisma-pagination'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const getAllSchoolMembershipsParamsSchema = z
	.object({
		schoolId: snowflakeSchema,
	})
	.merge(paginationParamsSchema)

export type GetAllSchoolMembershipsParams = z.infer<
	typeof getAllSchoolMembershipsParamsSchema
>
export type GetAllSchoolMembershipsResult = {
	id: Snowflake
	name: string
	price: number
	interval: 'day' | 'month' | 'week' | 'year'
	intervalCount: number
	classes: Snowflake[]
	students: Snowflake[]
}[]

export const getAllSchoolMemberships: Procedure<
	GetAllSchoolMembershipsParams,
	GetAllSchoolMembershipsResult
> = async ({ ctx, input: { schoolId, pagination } }) => {
	useSchoolAuthentication(ctx, schoolId)
	const memberships = await ctx.db.membership.findMany({
		where: { schoolId },
		select: {
			id: true,
			name: true,
			stripeProductId: true,
			classes: { select: { id: true } },
			students: { select: { studentId: true } },
		},
		...prismaPagination(pagination),
	})

	// const prices = await Promise.all(
	// 	memberships.map(({ stripeProductId }) =>
	// 		getMembershipPrice(ctx, { stripeProductId })
	// 	)
	// )

	return memberships.map(({ stripeProductId, ...membership }, i) => {
		return {
			...membership,
			price: 0,
			interval: 'day',
			intervalCount: 0,
			classes: membership.classes.map(({ id }) => id),
			students: membership.students.map(({ studentId }) => studentId),
		}
	})
}
