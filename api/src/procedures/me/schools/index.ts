import { router } from '@trpc/server'
import { z } from 'zod'
import { Context } from '../..'
import { getAllMeInvites } from '../invites/get-all'
import { getUserSchools } from './get'

export const userSchoolsRouter = router<Context>()
	.query('get', {
		input: z.void(),
		resolve: getUserSchools,
	})
	.query('getAll', { resolve: getAllMeInvites })

export * from './get'
