import { schoolRowSchema } from '@mat-master/database'
import { z } from 'zod'
import { Procedure } from '..'
import { db } from '../..'
import { snowflakeSchema } from '../../models'

export const getSchoolParamsSchema = z.object({ id: snowflakeSchema })
export const getSchoolResultSchema = schoolRowSchema.omit({
	stripeAccountId: true,
	stripeSubscriptionId: true,
})

export type GetSchoolParams = z.infer<typeof getSchoolParamsSchema>
export type GetSchoolResult = z.infer<typeof getSchoolResultSchema>

export const getSchool: Procedure<GetSchoolParams, GetSchoolResult> = async ({
	ctx: { payload },
	input: { id },
}) => {
	if (!payload || payload.privilege === 'Unverified')
		throw 'Missing or invalid authorization'

	try {
		const school = await db.school.findUnique({ where: { id } })
		return getSchoolResultSchema.parse(school)
	} catch (error) {
		console.error(`internal server error: ${error}`)
		throw 'An unknown error occurred'
	}
}
