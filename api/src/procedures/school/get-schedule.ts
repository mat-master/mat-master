import { ClassTime } from '@prisma/client'
import { z } from 'zod'
import { Procedure } from '..'
import { snowflakeSchema } from '../../models'
import { useSchoolAuthentication } from '../../util/use-school-authentication'

export const getSchoolScheduleParamsSchema = z.object({
	schoolId: snowflakeSchema,
	reference: z.date().optional(),
	scope: z.enum(['day', 'week', 'month']),
})

export type GetSchoolScheduleParams = z.infer<typeof getSchoolScheduleParamsSchema>
export type GetSchoolScheduleResult = ClassTime[]

export const getSchoolSchedule: Procedure<
	GetSchoolScheduleParams,
	GetSchoolScheduleResult
> = async ({ ctx, input: { schoolId, reference = new Date(), scope } }) => {
	useSchoolAuthentication(ctx.payload, schoolId)
	return await ctx.db.classTime.findMany({
		where: {
			class: { schoolId },
			scheduleStart: { gte: reference },
		},
	})
}
