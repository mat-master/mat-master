import { snowflakeSchema } from '@mat-master/common'
import { z } from 'zod'
import { Procedure } from '../..'
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
	useSchoolAuthentication(ctx, schoolId)
	const [{ name: schoolName }] = await Promise.all([
		ctx.db.school.findUnique({
			where: { id: schoolId },
			select: { name: true },
			rejectOnNotFound: true,
		}),
		ctx.db.invite.create({
			data: {
				email,
				school: { connect: { id: schoolId } },
			},
		}),
	])

	await sendInviteEmail(email, { id: schoolId, name: schoolName })
}
