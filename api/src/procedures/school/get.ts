import { schoolRowSchema } from '@mat-master/database'
import { School } from '@prisma/client'
import { z } from 'zod'
import { Procedure } from '..'
import { db } from '../..'
import { snowflakeSchema } from '../../models'
import { useAuthentication } from '../../util/use-authentication'

export const getSchoolParamsSchema = z.object({ id: snowflakeSchema })
export const getSchoolResultSchema = schoolRowSchema.omit({
	stripeAccountId: true,
	stripeSubscriptionId: true,
})

export type GetSchoolParams = z.infer<typeof getSchoolParamsSchema>
export type GetSchoolResult = z.infer<typeof getSchoolResultSchema>

export const getSchool: Procedure<GetSchoolParams, GetSchoolResult> = async ({
	ctx,
	input: { id },
}) => {
	const payload = useAuthentication(ctx)
	let school: School | null

	try {
		school = await db.school.findUnique({ where: { id } })
	} catch (error) {
		console.error(`internal server error: ${error}`)
		throw 'An unknown error occurred'
	}

	if (!school) throw 'Not found'
	if (school.ownerId !== payload.id)
		throw 'You dont have permission to access this resource'
	return getSchoolResultSchema.parse(school)
}
