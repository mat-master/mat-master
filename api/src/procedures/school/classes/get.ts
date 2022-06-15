import { Class, ClassTime } from '@prisma/client'
import { z } from 'zod'
import { Procedure } from '../..'
import { snowflakeSchema } from '../../../models'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const getSchoolClassParamsSchema = z.object({
	id: snowflakeSchema,
	schoolId: snowflakeSchema,
})

export type GetSchoolClassParams = z.infer<typeof getSchoolClassParamsSchema>
export type GetSchoolClassResult = Class & { schedule: ClassTime[] }

export const getSchoolClass: Procedure<GetSchoolClassParams, Class> = async ({
	ctx,
	input: { id, schoolId },
}) => {
	useSchoolAuthentication(ctx, schoolId)
	return await ctx.db.class.findUnique({
		where: { id },
		include: { schedule: true },
		rejectOnNotFound: true,
	})
}
