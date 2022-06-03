import { z } from 'zod'
import { Procedure } from '../..'
import { snowflakeSchema } from '../../../models'
import { privateErrors } from '../../../util/private-errors'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const deleteSchoolClassParamsSchema = z.object({
	id: snowflakeSchema,
	schoolId: snowflakeSchema,
})

export type DeleteSchoolClassParams = z.infer<typeof deleteSchoolClassParamsSchema>

export const deleteSchoolClass: Procedure<DeleteSchoolClassParams> = async ({
	ctx,
	input: { id, schoolId },
}) => {
	await useSchoolAuthentication(ctx, schoolId)
	await privateErrors(() => ctx.db.class.delete({ where: { id } }))
}
