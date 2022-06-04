import { router } from '@trpc/server'
import { Context } from '../..'
import { getUserInvites } from './get'
import { getAllMeInvites } from './get-all'

export const userInvitesRouter = router<Context>()
	.query('get', {
		resolve: getUserInvites,
	})
	.query('getAll', { resolve: getAllMeInvites })

export * from './get'
export * from './get-all'

