import { router } from '@trpc/server'
import { authLoginParamsSchema, login } from './login'

export const authRouter = router().query('login', {
	input: authLoginParamsSchema,
	resolve: login,
})

export * from './login'
