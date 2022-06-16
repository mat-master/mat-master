import { router } from '@trpc/server'
import { Context } from '../..'
import { setupUserBilling } from './setup'

export const userBillingRouter = router<Context>().mutation('setup', {
	resolve: setupUserBilling,
})
