import { router } from '@trpc/server'
import login, { authLoginParamsSchema } from './login'

const authRouter = router().query('login', {
	input: authLoginParamsSchema,
	resolve: login,
})

export * from './login'

export default authRouter
