import { router } from '@trpc/server'
import { authLoginParamsSchema, login } from './login'
import { authSignupParamsSchema, signup } from './signup'
import { authVerifyParamsSchema, verify } from './verify'

export const authRouter = router()
	.query('login', {
		input: authLoginParamsSchema,
		resolve: login,
	})
	.mutation('signup', {
		input: authSignupParamsSchema,
		resolve: signup,
	})
	.mutation('verify', {
		input: authVerifyParamsSchema,
		resolve: verify,
	})

export * from './login'
