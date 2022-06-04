import { z } from 'zod'
import { Procedure } from '../..'
import { snowflakeSchema } from '../../../models'
import { privateErrors } from '../../../util/private-errors'
import { sendInviteEmail } from '../../../util/send-invite-email'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const createSchoolInviteParamsSchema = z.object({
	schoolId: snowflakeSchema,
	email: z.string().email(),
})

export type CreateSchoolInviteParams = z.infer<
	typeof createSchoolInviteParamsSchema
>

export const createSchoolInvite: Procedure<CreateSchoolInviteParams> = async ({
	ctx,
	input: { schoolId, email },
}) => {
	const { school } = await useSchoolAuthentication(ctx, schoolId)
	await privateErrors(async () => {
		await ctx.db.invite.create({
			data: {
				email,
				school: { connect: { id: schoolId } },
			},
		})

		await sendInviteEmail(email, school)
	})
}
