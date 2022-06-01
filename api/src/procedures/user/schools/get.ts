import { schoolRowSchema } from '@mat-master/database'
import { z } from 'zod'
import { Procedure } from '../..'
import { db } from '../../..'

const schoolResultSchema = schoolRowSchema.omit({
	stripeAccountId: true,
	stripeSubscriptionId: true,
})

type SchoolResult = z.infer<typeof schoolResultSchema>
export interface UserSchoolsGetResult {
	student: SchoolResult[]
	owner: SchoolResult[]
}

export const getUserSchools: Procedure<void, UserSchoolsGetResult> = async ({
	ctx: { payload },
}) => {
	if (!payload) throw 'Missing or invalid authorization header'
	const [studentSchools, ownerSchools] = await Promise.all([
		db.school.findMany({ where: { students: { some: { id: payload.id } } } }),
		db.school.findMany({ where: { ownerId: payload.id } }),
	])

	return {
		owner: ownerSchools.map((school) => schoolResultSchema.parse(school)),
		student: studentSchools.map((school) => schoolResultSchema.parse(school)),
	}
}
