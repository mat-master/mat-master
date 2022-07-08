import { Snowflake, snowflakeSchema } from '@mat-master/common'
import { z } from 'zod'
import { Procedure } from '../..'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const getSchoolStudentParamsSchema = z.object({
	id: snowflakeSchema,
	schoolId: snowflakeSchema,
})

export type GetSchoolStudentParams = z.infer<typeof getSchoolStudentParamsSchema>
export type GetSchoolStudentResult = {
	id: Snowflake
	schoolId: Snowflake
	user: {
		id: Snowflake
		email: string
		firstName: string
		lastName: string
		avatar: bigint | null
	}
	memberships: Snowflake[]
}

export const getSchoolStudent: Procedure<
	GetSchoolStudentParams,
	GetSchoolStudentResult
> = async ({ ctx, input: { id, schoolId } }) => {
	useSchoolAuthentication(ctx, schoolId)
	const student = await ctx.db.student.findFirst({
		where: { id, schoolId },
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
				select: { membershipId: true },
			},
		},
	})

	if (!student) throw 'Student not found'
	return {
		...student,
		memberships: student.memberships.map(({ membershipId }) => membershipId),
	}
}
