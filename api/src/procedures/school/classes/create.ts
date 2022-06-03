import { classRowSchema } from '@mat-master/database'
import { z } from 'zod'
import { Procedure } from '../..'
import { Snowflake } from '../../../models'
import { generateSnowflake } from '../../../util/generate-snowflake'
import { privateErrors } from '../../../util/private-errors'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const createSchoolClassParamsSchema = classRowSchema.omit({ id: true })

export type CreateSchoolClassParams = z.infer<typeof createSchoolClassParamsSchema>
export type CreateSchoolClassResult = { id: Snowflake }

export const createSchoolClass: Procedure<
	CreateSchoolClassParams,
	CreateSchoolClassResult
> = async ({ ctx, input: { schoolId, ...data } }) => {
	await useSchoolAuthentication(ctx, schoolId)
	const _class = await privateErrors(() =>
		ctx.db.class.create({
			data: {
				id: generateSnowflake(),
				school: { connect: { id: schoolId } },
				...data,
			},
		})
	)

	return { id: _class.id }
}
