import { router } from '@trpc/server'
import { Context } from '..'
import { kioskLoginParams, login } from './login'

export const kioskRouter = router<Context>().query('login', {
	input: kioskLoginParams,
	resolve: login,
})
