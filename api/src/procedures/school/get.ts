import { snowflakeSchema } from '@mat-master/common'
import { schoolRowSchema } from '@mat-master/database'
import { z } from 'zod'
import { Procedure } from '..'
import { useSchoolAuthentication } from '../../util/use-school-authentication'

export const getSchoolParamsSchema = z.object({ id: snowflakeSchema })
export const getSchoolResultSchema = schoolRowSchema.omit({
	tier: true,
	stripeAccountId: true,
	stripeSubscriptionId: true,
})

export type GetSchoolParams = z.infer<typeof getSchoolParamsSchema>
export type GetSchoolResult = z.infer<typeof getSchoolResultSchema>

export const getSchool: Procedure<GetSchoolParams, GetSchoolResult> = async ({
	ctx,
	input: { id },
}) => {
	useSchoolAuthentication(ctx, id)
	const school = await ctx.db.school.findUnique({ where: { id } })

	if (!school) throw 'School not found'

	return getSchoolResultSchema.parse(school)
}
