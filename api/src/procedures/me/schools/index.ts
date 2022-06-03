import { router } from '@trpc/server'
import { z } from 'zod'
import { Context } from '../..'
import { getUserSchools } from './get'

export const userSchoolsRouter = router<Context>().query('get', {
	input: z.void(),
	resolve: getUserSchools,
})

export * from './get'
