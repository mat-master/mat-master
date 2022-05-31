import { router } from '@trpc/server'
import { z } from 'zod'
import { Context } from '../..'
import { get } from './get'

export const userInvitesRouter = router<Context>().query('get', {
	input: z.void(),
	resolve: get,
})
