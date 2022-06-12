import { classRowSchema } from '@mat-master/database'
import { z } from 'zod'
import { Procedure } from '../..'
import { Snowflake } from '../../../models'
import { generateSnowflake } from '../../../util/generate-snowflake'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const createSchoolClassParamsSchema = classRowSchema.omit({ id: true })

export type CreateSchoolClassParams = z.infer<typeof createSchoolClassParamsSchema>
export type CreateSchoolClassResult = { id: Snowflake }

export const createSchoolClass: Procedure<
	CreateSchoolClassParams,
	CreateSchoolClassResult
> = async ({ ctx, input: { schoolId, ...data } }) => {
	useSchoolAuthentication(ctx.payload, schoolId)
	return await ctx.db.class.create({
		data: {
			id: generateSnowflake(),
			school: { connect: { id: schoolId } },
			...data,
		},
		select: { id: true },
	})
}
