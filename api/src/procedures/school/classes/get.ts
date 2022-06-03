import { Class } from '@prisma/client'
import { z } from 'zod'
import { Procedure } from '../..'
import { db } from '../../..'
import { snowflakeSchema } from '../../../models'
import { privateErrors } from '../../../util/private-errors'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const getSchoolClassParamsSchema = z.object({
	id: snowflakeSchema,
	schoolId: snowflakeSchema,
})

export type GetSchoolClassParams = z.infer<typeof getSchoolClassParamsSchema>

export const getSchoolClass: Procedure<GetSchoolClassParams, Class> = async ({
	ctx,
	input: { id, schoolId },
}) => {
	await useSchoolAuthentication(ctx, schoolId)
	return await privateErrors(async () =>
		db.class.findUnique({ where: { id }, rejectOnNotFound: true })
	)
}
