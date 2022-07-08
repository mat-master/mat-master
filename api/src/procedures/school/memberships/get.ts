import { snowflakeSchema } from '@mat-master/common'
import { z } from 'zod'
import { Procedure } from '../..'
import { getMembershipPrice } from '../../../util/get-membership-price'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const getSchoolMembershipParamsSchema = z.object({
	id: snowflakeSchema,
	schoolId: snowflakeSchema,
})

export const getSchoolMembershipResultSchema = z.object({
	id: snowflakeSchema,
	name: z.string(),
	price: z.number().int(),
	interval: z.enum(['day', 'month', 'week', 'year']),
	intervalCount: z.number().int(),
	classes: z.array(snowflakeSchema),
	students: z.array(snowflakeSchema),
})

export type GetSchoolMembershipParams = z.infer<
	typeof getSchoolMembershipParamsSchema
>
export type GetSchoolMembershipResult = z.infer<
	typeof getSchoolMembershipResultSchema
>

export const getSchoolMembership: Procedure<
	GetSchoolMembershipParams,
	GetSchoolMembershipResult
> = async ({ ctx, input: { id, schoolId } }) => {
	useSchoolAuthentication(ctx, schoolId)

	const [school, membership] = await Promise.all([
		ctx.db.school.findUnique({
			where: { id: schoolId },
			select: { stripeAccountId: true },
			rejectOnNotFound: true,
		}),
		ctx.db.membership.findFirst({
			where: { id, schoolId },
			select: {
				name: true,
				stripeProductId: true,
				classes: { select: { classId: true } },
				students: { select: { studentId: true } },
			},
		}),
	])

	if (!membership) throw 'Membership not found'
	const price = await getMembershipPrice(ctx, membership, school.stripeAccountId)

	return {
		id,
		name: membership.name,
		price: price.unit_amount!,
		interval: price.recurring!.interval,
		intervalCount: price.recurring!.interval_count,
		classes: membership.classes.map(({ classId }) => classId),
		students: membership.students.map(({ studentId }) => studentId),
	}
}
