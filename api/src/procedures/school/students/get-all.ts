import { Snowflake, snowflakeSchema } from '@mat-master/common'
import { User } from '@prisma/client'
import { z } from 'zod'
import { Procedure } from '../..'
import {
	paginationParamsSchema,
	prismaPagination,
} from '../../../util/prisma-pagination'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const getAllSchoolStudentsParamsSchema = z
	.object({
		schoolId: snowflakeSchema,
	})
	.merge(paginationParamsSchema)

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
> = async ({ ctx, input: { schoolId, pagination } }) => {
	useSchoolAuthentication(ctx, schoolId)
	const students = await ctx.db.student.findMany({
		...prismaPagination(pagination),
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

	return students.map((student) => ({
		...student,
		memberships: student.memberships.map(({ membership }) => membership.id),
	}))
}
