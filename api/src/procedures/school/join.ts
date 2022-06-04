import { z } from 'zod'
import { Procedure } from '..'
import { db, stripe } from '../..'
import { Snowflake, snowflakeSchema } from '../../models'
import { generateSnowflake } from '../../util/generate-snowflake'
import { privateErrors } from '../../util/private-errors'
import { useAuthentication } from '../../util/use-authentication'

export const joinSchoolParamsSchema = z.object({ id: snowflakeSchema })

export type JoinSchoolParams = z.infer<typeof joinSchoolParamsSchema>
export type JoinSchoolResult = { id: Snowflake }

export const joinSchool: Procedure<JoinSchoolParams, JoinSchoolResult> = async ({
	ctx,
	input: { id: schoolId },
}) => {
	const payload = useAuthentication(ctx)
	if (!payload.emailVerified)
		throw 'You need to verify your email before you can join a school'

	const paymentMethods = (
		await privateErrors(() =>
			stripe.customers.listPaymentMethods(payload.id.toString(), {
				type: 'card',
			})
		)
	).data
	if (!paymentMethods.length) throw 'Missing payment method'

	const inviteCount = await privateErrors(() =>
		db.invite.deleteMany({
			where: { schoolId, email: payload.email },
		})
	)
	if (!inviteCount) throw "You haven't been invited to that school"

	const [school, user] = await privateErrors(() =>
		Promise.all([
			db.school.findUnique({
				where: { id: schoolId },
				select: { stripeAccountId: true },
			}),
			db.user.findUnique({
				where: { id: payload.id },
				rejectOnNotFound: true,
			}),
		])
	)

	if (!school) throw 'School not found'
	const student = await privateErrors(async () => {
		const token = await stripe.tokens.create(
			{ customer: payload.stripeCustomerId! },
			{ stripeAccount: school.stripeAccountId }
		)

		const customer = await stripe.customers.create(
			{
				name: `${user.firstName} ${user.lastName}`,
				email: user.email,
				source: token.id,
			},
			{ stripeAccount: school.stripeAccountId }
		)

		return await db.student.create({
			data: {
				id: generateSnowflake(),
				user: { connect: { id: user.id } },
				school: { connect: { id: schoolId } },
				stripeCustomerId: customer.id,
			},
		})
	})

	return { id: student.id }
}
