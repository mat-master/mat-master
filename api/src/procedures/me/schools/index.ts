import { router } from '@trpc/server'
import { Context } from '../..'
import { getUserSchools } from './get'
import { getAllMeSchools, getAllMeSchoolsParamsSchema } from './get-all'

export const userSchoolsRouter = router<Context>()
	.query('get', { resolve: getUserSchools })
	.query('all.get', {
		input: getAllMeSchoolsParamsSchema,
		resolve: getAllMeSchools,
	})

export * from './get'
export * from './get-all'

