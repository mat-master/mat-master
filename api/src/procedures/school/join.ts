import { z } from 'zod'
import { Procedure } from '..'
import { Snowflake, snowflakeSchema } from '../../models'
import { generateSnowflake } from '../../util/generate-snowflake'
import { useAuthentication } from '../../util/use-authentication'

export const joinSchoolParamsSchema = z.object({ id: snowflakeSchema })

export type JoinSchoolParams = z.infer<typeof joinSchoolParamsSchema>
export type JoinSchoolResult = { id: Snowflake }

export const joinSchool: Procedure<JoinSchoolParams, JoinSchoolResult> = async ({
	ctx,
	input: { id: schoolId },
}) => {
	useAuthentication(ctx)
	if (!ctx.payload.emailVerified)
		throw 'You need to verify your email before you can join a school'

	const paymentMethods = (
		await ctx.stripe.customers.listPaymentMethods(ctx.payload.id.toString(), {
			type: 'card',
		})
	).data
	if (!paymentMethods.length) throw 'Missing payment method'

	const invites = await ctx.db.invite.deleteMany({
		where: { schoolId, email: ctx.payload.email },
	})
	if (!invites.count) throw "You haven't been invited to that school"

	const [school, user] = await Promise.all([
		ctx.db.school.findUnique({
			where: { id: schoolId },
			select: { stripeAccountId: true },
			rejectOnNotFound: true,
		}),
		ctx.db.user.findUnique({
			where: { id: ctx.payload.id },
			select: { firstName: true, lastName: true },
			rejectOnNotFound: true,
		}),
	])

	const token = await ctx.stripe.tokens.create(
		{ customer: ctx.payload.stripeCustomerId! },
		{ stripeAccount: school.stripeAccountId }
	)

	const customer = await ctx.stripe.customers.create(
		{
			name: `${user.firstName} ${user.lastName}`,
			email: ctx.payload.email,
			source: token.id,
		},
		{ stripeAccount: school.stripeAccountId }
	)

	return await ctx.db.student.create({
		data: {
			id: generateSnowflake(),
			stripeCustomerId: customer.id,
			user: { connect: { id: ctx.payload.id } },
			school: { connect: { id: schoolId } },
		},
		select: { id: true },
	})
}
