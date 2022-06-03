import { classRowSchema } from '@mat-master/database'
import { z } from 'zod'
import { Procedure } from '../..'
import { privateErrors } from '../../../util/private-errors'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const updateSchoolClassParamsSchema = classRowSchema
	.partial()
	.merge(classRowSchema.pick({ id: true, schoolId: true }))

export type UpdateSchoolClassParams = z.infer<typeof updateSchoolClassParamsSchema>

export const updateSchoolClass: Procedure<UpdateSchoolClassParams> = async ({
	ctx,
	input: { id, schoolId, ...data },
}) => {
	await useSchoolAuthentication(ctx, schoolId)
	await privateErrors(() => ctx.db.class.update({ where: { id }, data }))
}
