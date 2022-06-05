import { router } from '@trpc/server'
import { Context } from '../..'
import { getUserInvites } from './get'
import { getAllMeInvites, getAllMeInvitesParamsSchema } from './get-all'

export const userInvitesRouter = router<Context>()
	.query('get', {
		resolve: getUserInvites,
	})
	.query('getAll', {
		input: getAllMeInvitesParamsSchema,
		resolve: getAllMeInvites,
	})

export * from './get'
export * from './get-all'

