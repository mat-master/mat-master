import { Snowflake, snowflakeSchema } from '@mat-master/common'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { Procedure } from '../..'
import { generateSnowflake } from '../../../util/generate-snowflake'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const createSchoolMembershipParamsSchema = z.object({
	schoolId: snowflakeSchema,
	name: z.string(),
	price: z.number().int(),
	interval: z.enum(['day', 'month', 'week', 'year']),
	intervalCount: z.number().int(),
	classes: z.array(snowflakeSchema),
})

export type CreateSchoolMembershipParams = z.infer<
	typeof createSchoolMembershipParamsSchema
>
export interface CreateSchoolMembershipResult {
	id: Snowflake
}

export const createSchoolMembership: Procedure<
	CreateSchoolMembershipParams,
	CreateSchoolMembershipResult
> = async ({ ctx, input: { schoolId, ...data } }) => {
	useSchoolAuthentication(ctx, schoolId)

	const [school, classes] = await Promise.all([
		ctx.db.school.findUnique({
			where: { id: schoolId },
			select: { stripeAccountId: true },
			rejectOnNotFound: true,
		}),
		ctx.db.class.findMany({
			where: { id: { in: data.classes }, schoolId },
			select: { id: true },
		}),
	])

	// check that every class exists and is owned by the given school
	if (classes.length !== data.classes.length)
		throw new TRPCError({
			code: 'NOT_FOUND',
			message: "Couldn't find one or more of the given classes",
		})

	const product = await ctx.stripe.products.create(
		{
			name: `${data.name} Membership`,
			default_price_data: {
				currency: 'USD',
				unit_amount: data.price,
				recurring: {
					interval: data.interval,
					interval_count: data.intervalCount,
				},
			},
		},
		{ stripeAccount: school.stripeAccountId }
	)

	return await ctx.db.membership.create({
		data: {
			id: generateSnowflake(),
			name: data.name,
			school: { connect: { id: schoolId } },
			classes: { createMany: { data: classes.map(({ id }) => ({ classId: id })) } },
			stripeProductId: product.id,
		},
		select: { id: true },
	})
}
