import { z } from 'zod'
import { Procedure } from '../..'
import { snowflakeSchema } from '../../../models'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const deleteSchoolInviteParamsSchema = z.object({
	email: z.string().email(),
	schoolId: snowflakeSchema,
})

export type DeleteSchoolInviteParams = z.infer<
	typeof deleteSchoolInviteParamsSchema
>

export const deleteSchoolInvite: Procedure<DeleteSchoolInviteParams> = async ({
	ctx,
	input: { email, schoolId },
}) => {
	useSchoolAuthentication(ctx, schoolId)
	await ctx.db.invite.delete({ where: { schoolId_email: { email, schoolId } } })
}
