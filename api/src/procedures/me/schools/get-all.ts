import { Procedure } from '../..'
import { Snowflake } from '../../../models'
import { privateErrors } from '../../../util/private-errors'
import { useAuthentication } from '../../../util/use-authentication'

export type GetAllMeSchoolsResult = {
	id: Snowflake
	name: string
	ownerId: Snowflake
}[]

export const getAllMeSchools: Procedure<void, GetAllMeSchoolsResult> = async ({
	ctx,
}) => {
	const payload = useAuthentication(ctx)
	const user = await privateErrors(() =>
		ctx.db.user.findUnique({
			where: { id: payload.id },
			include: {
				schools: {
					select: { id: true, name: true, ownerId: true },
				},
			},
			rejectOnNotFound: true,
		})
	)

	return user.schools
}
