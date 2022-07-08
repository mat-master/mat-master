import { Snowflake } from '@mat-master/common'
import { classRowSchema, classTimeRowSchema } from '@mat-master/database'
import { z } from 'zod'
import { Procedure } from '../..'
import { generateSnowflake } from '../../../util/generate-snowflake'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const createSchoolClassParamsSchema = classRowSchema
	.omit({ id: true })
	.extend({
		schedule: classTimeRowSchema.omit({ id: true, classId: true }).array(),
	})

export type CreateSchoolClassParams = z.infer<typeof createSchoolClassParamsSchema>
export type CreateSchoolClassResult = { id: Snowflake }

export const createSchoolClass: Procedure<
	CreateSchoolClassParams,
	CreateSchoolClassResult
> = async ({ ctx, input: { schoolId, ...data } }) => {
	useSchoolAuthentication(ctx, schoolId)
	return await ctx.db.class.create({
		data: {
			id: generateSnowflake(),
			school: { connect: { id: schoolId } },
			...data,
			schedule: {
				createMany: {
					data: data.schedule.map((time) => ({
						id: generateSnowflake(),
						...time,
					})),
				},
			},
		},
		select: { id: true },
	})
}
