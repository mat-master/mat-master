import { schoolRowSchema } from '@mat-master/database'
import { z } from 'zod'
import { Procedure } from '..'
import { db } from '../..'
import { snowflakeSchema } from '../../models'
import { privateErrors } from '../../util/private-errors'
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
	const school = await privateErrors(() => db.school.findUnique({ where: { id } }))

	if (!school) throw 'School not found'
	if (school.ownerId !== payload.id) throw "You aren't the owner of that school"

	return getSchoolResultSchema.parse(school)
}
