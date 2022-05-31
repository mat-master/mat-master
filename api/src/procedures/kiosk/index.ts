import { router } from '@trpc/server'
import { kioskLoginParams, login } from './login'

export const kioskRouter = router().query('login', {
	input: kioskLoginParams,
	resolve: login,
})
