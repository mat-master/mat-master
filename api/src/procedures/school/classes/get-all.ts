import { Class } from '@prisma/client'
import { z } from 'zod'
import { Procedure } from '../..'
import { snowflakeSchema } from '../../../models'
import { privateErrors } from '../../../util/private-errors'
import { useSchoolAuthentication } from '../../../util/use-school-authentication'

export const getAllSchoolClassesParamsSchema = z.object({
	schoolId: snowflakeSchema,
})

export type GetAllSchoolClassesParams = z.infer<
	typeof getAllSchoolClassesParamsSchema
>
export type GetAllSchoolClassesResult = Class[]

export const getAllSchoolClasses: Procedure<
	GetAllSchoolClassesParams,
	GetAllSchoolClassesResult
> = async ({ ctx, input: { schoolId } }) => {
	await useSchoolAuthentication(ctx, schoolId)
	return await privateErrors(() => ctx.db.class.findMany({ where: { schoolId } }))
}
