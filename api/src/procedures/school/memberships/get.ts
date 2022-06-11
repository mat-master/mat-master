import { z } from 'zod'
import { Procedure } from '../..'
import { snowflakeSchema } from '../../../models'
import { getMembershipPrice } from '../../../util/get-membership-price'
import { privateErrors } from '../../../util/private-errors'
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
	useSchoolAuthentication(ctx.payload, schoolId)
	const membership = await privateErrors(() =>
		ctx.db.membership.findFirst({
			where: { id, schoolId },
			select: {
				name: true,
				stripeProductId: true,
				classes: { select: { id: true } },
				students: { select: { studentId: true } },
			},
		})
	)
	if (!membership) throw 'Membership not found'

	const price = await privateErrors(() => getMembershipPrice(ctx, membership))
	return {
		id,
		name: membership.name,
		price: price.unit_amount!,
		interval: price.recurring!.interval,
		intervalCount: price.recurring!.interval_count,
		classes: membership.classes.map(({ id }) => id),
		students: membership.students.map(({ studentId }) => studentId),
	}
}
