import { z } from 'zod'
import { Procedure } from '../..'
import { db, stripe } from '../../..'
import { snowflakeSchema } from '../../../models'
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
	await useSchoolAuthentication(ctx, schoolId)

	const membership = await privateErrors(() =>
		db.membership.findFirst({
			where: { id, schoolId },
			include: {
				classes: { select: { id: true } },
				students: { select: { studentId: true } },
			},
		})
	)
	if (!membership) throw 'Membership not found'

	const price = await privateErrors(async () => {
		const prices = await stripe.prices.list({
			active: true,
			product: membership.stripeProductId,
		})

		const price = prices.data.find(
			(price) => !!price.recurring && !!price.unit_amount
		)
		if (!price) throw "membership doesn't have any prices"
		return {
			price: price.unit_amount!,
			interval: price.recurring!.interval,
			intervalCount: price.recurring!.interval_count,
		}
	})

	return {
		id,
		name: membership.name,
		...price,
		classes: membership.classes.map(({ id }) => id),
		students: membership.students.map(({ studentId }) => studentId),
	}
}
