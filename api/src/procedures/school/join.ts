import Stripe from 'stripe'
import { z } from 'zod'
import { Procedure } from '..'
import { db, stripe } from '../..'
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
	const payload = useAuthentication(ctx)
	if (payload.privilege === 'Unverified')
		throw 'You need to verify your email before you can join a school'

	let inviteDeleteCount: number
	try {
		inviteDeleteCount = (
			await db.invite.deleteMany({
				where: { schoolId, email: payload.email },
			})
		).count
	} catch (error) {
		console.error(`internal server errror: ${error}`)
		throw 'An unknown error ocurred'
	}

	if (!inviteDeleteCount) throw "You haven't been invited to that school"

	let paymentMethods: Stripe.PaymentMethod[]
	try {
		paymentMethods = (
			await stripe.customers.listPaymentMethods(payload.id.toString(), {
				type: 'card',
			})
		).data
	} catch (error) {
		console.error(`internal server error: ${error}`)
		throw 'An unknown error occurred'
	}

	if (!paymentMethods.length) throw 'Missing payment method'

	try {
		const [school, user] = await Promise.all([
			db.school.findUnique({ where: { id: schoolId } }),
			db.user.findUnique({ where: { id: payload.id } }),
		])

		if (!school) throw 'school not found'
		if (!user) throw 'user not found'

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

		const id = generateSnowflake()
		if (!id) throw 'error generating snowflake'

		await db.student.create({
			data: {
				id,
				user: { connect: { id: user.id } },
				school: { connect: { id: schoolId } },
				stripeCustomerId: customer.id,
			},
		})

		return { id }
	} catch (error) {
		console.error(`internal server error: ${error}`)
		throw 'An unknown error occurred'
	}
}
