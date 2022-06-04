import { z } from 'zod'
import { Procedure } from '../..'
import { snowflakeSchema } from '../../../models'
import { privateErrors } from '../../../util/private-errors'
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
	input,
}) => {
	await useSchoolAuthentication(ctx, input.schoolId)
	await privateErrors(() =>
		ctx.db.invite.delete({ where: { schoolId_email: input } })
	)
}
