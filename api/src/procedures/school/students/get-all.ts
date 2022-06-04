import { User } from '@prisma/client'
import { z } from 'zod'
import { Procedure } from '../..'
import { Snowflake, snowflakeSchema } from '../../../models'
import { privateErrors } from '../../../util/private-errors'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const getAllSchoolStudentsParamsSchema = z.object({
	schoolId: snowflakeSchema,
})

export type GetAllSchoolStudentsParams = z.infer<
	typeof getAllSchoolStudentsParamsSchema
>
export type GetAllSchoolStudentsResult = {
	id: Snowflake
	schoolId: Snowflake
	user: Omit<User, 'emailVerified' | 'password' | 'stripeCustomerId'>
	memberships: Snowflake[]
}[]

export const getAllSchoolStudents: Procedure<
	GetAllSchoolStudentsParams,
	GetAllSchoolStudentsResult
> = async ({ ctx, input: { schoolId } }) => {
	await useSchoolAuthentication(ctx, schoolId)
	const students = await privateErrors(() =>
		ctx.db.student.findMany({
			where: { schoolId },
			select: {
				id: true,
				schoolId: true,
				user: {
					select: {
						id: true,
						email: true,
						firstName: true,
						lastName: true,
						avatar: true,
					},
				},
				memberships: {
					select: {
						membership: {
							select: {
								id: true,
							},
						},
					},
				},
			},
		})
	)

	return students.map((student) => ({
		...student,
		memberships: student.memberships.map(({ membership }) => membership.id),
	}))
}
