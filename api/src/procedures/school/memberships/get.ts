import { z } from 'zod'
import { Procedure } from '../..'
import { snowflakeSchema } from '../../../models'
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
	const membership = await ctx.db.membership.findFirst({
		where: { id, schoolId },
		select: {
			name: true,
			stripeProductId: true,
			classes: { select: { id: true } },
			students: { select: { studentId: true } },
		},
	})
	if (!membership) throw 'Membership not found'

	// const price = await getMembershipPrice(ctx, membership)

	return {
		id,
		name: membership.name,
		price: 0,
		interval: 'day',
		intervalCount: 0,
		classes: membership.classes.map(({ id }) => id),
		students: membership.students.map(({ studentId }) => studentId),
	}
}
