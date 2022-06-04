import { z } from 'zod'
import { Procedure } from '../..'
import { Snowflake } from '../../../models'
import {
	paginationParamsSchema,
	prismaPagination,
} from '../../../util/prisma-pagination'
import { privateErrors } from '../../../util/private-errors'
import { useAuthentication } from '../../../util/use-authentication'

export const getAllMeSchoolsParamsSchema = paginationParamsSchema

export type GetAllMeSchoolsParams = z.infer<typeof getAllMeSchoolsParamsSchema>
export type GetAllMeSchoolsResult = {
	id: Snowflake
	name: string
	ownerId: Snowflake
}[]

export const getAllMeSchools: Procedure<
	GetAllMeSchoolsParams,
	GetAllMeSchoolsResult
> = async ({ ctx, input: { pagination } }) => {
	const payload = useAuthentication(ctx)
	const { schools } = await privateErrors(() =>
		ctx.db.user.findUnique({
			where: { id: payload.id },
			select: {
				schools: {
					...prismaPagination(pagination),
					select: {
						id: true,
						name: true,
						ownerId: true,
					},
				},
			},
			rejectOnNotFound: true,
		})
	)

	return schools
}
