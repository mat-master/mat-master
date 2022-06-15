import { classRowSchema } from '@mat-master/database'
import { z } from 'zod'
import { Procedure } from '../..'

import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const updateSchoolClassParamsSchema = classRowSchema
	.partial()
	.merge(classRowSchema.pick({ id: true, schoolId: true }))

export type UpdateSchoolClassParams = z.infer<typeof updateSchoolClassParamsSchema>

export const updateSchoolClass: Procedure<UpdateSchoolClassParams> = async ({
	ctx,
	input: { id, schoolId, ...data },
}) => {
	useSchoolAuthentication(ctx, schoolId)

	// Check that the given class is a part of the given school
	const _class = await ctx.db.class.findFirst({ where: { id, schoolId } })
	if (!_class) throw 'Class not found'

	await ctx.db.class.update({ where: { id }, data })
}
