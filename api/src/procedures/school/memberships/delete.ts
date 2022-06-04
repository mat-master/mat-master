import { z } from 'zod'
import { Procedure } from '../..'
import { snowflakeSchema } from '../../../models'
import { privateErrors } from '../../../util/private-errors'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const deleteSchoolMembershipParamsSchema = z.object({
	id: snowflakeSchema,
	schoolId: snowflakeSchema,
})

export type DeleteSchoolMembershipParams = z.infer<
	typeof deleteSchoolMembershipParamsSchema
>

export const deleteSchoolMembership: Procedure<
	DeleteSchoolMembershipParams
> = async ({ ctx, input: { id, schoolId } }) => {
	await useSchoolAuthentication(ctx, schoolId)
	const membership = await privateErrors(() =>
		ctx.db.membership.delete({ where: { id } })
	)
	if (!membership) throw 'Membership not found'
}
