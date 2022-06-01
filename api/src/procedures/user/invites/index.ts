import { router } from '@trpc/server'
import { z } from 'zod'
import { Context } from '../..'
import { getUserInvites } from './get'

export const userInvitesRouter = router<Context>().query('get', {
	input: z.void(),
	resolve: getUserInvites,
})

export * from './get'
