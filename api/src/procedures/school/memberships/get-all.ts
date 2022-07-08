import { Snowflake, snowflakeSchema } from '@mat-master/common'
import { z } from 'zod'
import { Procedure } from '../..'
import { getMembershipPrice } from '../../../util/get-membership-price'
import { paginationParamsSchema } from '../../../util/prisma-pagination'
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

	const { stripeAccountId, memberships } = await ctx.db.school.findUnique({
		where: { id: schoolId },
		select: {
			stripeAccountId: true,
			memberships: {
				select: {
					id: true,
					name: true,
					stripeProductId: true,
					classes: { select: { classId: true } },
					students: { select: { studentId: true } },
				},
			},
		},
		rejectOnNotFound: true,
	})

	const prices = await Promise.all(
		memberships.map(({ stripeProductId }) =>
			getMembershipPrice(ctx, { stripeProductId }, stripeAccountId)
		)
	)

	return memberships.map(({ stripeProductId, ...membership }, i) => {
		const price = prices[i]!

		return {
			...membership,
			price: price.unit_amount!,
			interval: price.recurring!.interval,
			intervalCount: price.recurring!.interval_count,
			classes: membership.classes.map(({ classId }) => classId),
			students: membership.students.map(({ studentId }) => studentId),
		}
	})
}
