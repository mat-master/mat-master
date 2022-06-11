import { schoolRowSchema } from '@mat-master/database'
import { z } from 'zod'
import { Procedure } from '../..'
import { useAuthentication } from '../../../util/use-authentication'

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
	ctx,
}) => {
	const payload = useAuthentication(ctx.payload)
	const [ownerSchools, studentSchools] = await Promise.all([
		ctx.db.school.findMany({ where: { students: { some: { id: payload.id } } } }),
		ctx.db.school.findMany({ where: { ownerId: payload.id } }),
	])

	return {
		owner: ownerSchools.map((school) => schoolResultSchema.parse(school)),
		student: studentSchools.map((school) => schoolResultSchema.parse(school)),
	}
}
