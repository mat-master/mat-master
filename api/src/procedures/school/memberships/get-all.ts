import { z } from 'zod'
import { Procedure } from '../..'
import { Snowflake, snowflakeSchema } from '../../../models'
import { getMembershipPrice } from '../../../util/get-membership-price'
import {
	paginationParamsSchema,
	prismaPagination,
} from '../../../util/prisma-pagination'
import { privateErrors } from '../../../util/private-errors'
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
	schoolId: Snowflake
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
	await useSchoolAuthentication(ctx, schoolId)
	const memberships = await privateErrors(() =>
		ctx.db.membership.findMany({
			where: { schoolId },
			select: {
				id: true,
				name: true,
				schoolId: true,
				stripeProductId: true,
				classes: { select: { id: true } },
				students: { select: { studentId: true } },
			},
			...prismaPagination(pagination),
		})
	)

	const prices = await privateErrors(() =>
		Promise.all(
			memberships.map(({ stripeProductId }) =>
				getMembershipPrice(ctx, { stripeProductId })
			)
		)
	)

	return memberships.map(({ stripeProductId, ...membership }, i) => {
		return {
			...membership,
			price: prices[i].unit_amount!,
			interval: prices[i].recurring!.interval,
			intervalCount: prices[i].recurring!.interval_count,
			classes: membership.classes.map(({ id }) => id),
			students: membership.students.map(({ studentId }) => studentId),
		}
	})
}
