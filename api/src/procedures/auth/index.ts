import { router } from '@trpc/server'
import { Context } from '..'
import { authLoginParamsSchema, login } from './login'
import { reSendVerificationEmail } from './resend-verification-email'
import { authSignupParamsSchema, signup } from './signup'
import { authVerifyParamsSchema, verify } from './verify'

export const authRouter = router<Context>()
	.query('login', {
		input: authLoginParamsSchema,
		resolve: login,
	})
	.mutation('signup', {
		input: authSignupParamsSchema,
		resolve: signup,
	})
	.mutation('resendVerificationEmail', {
		resolve: reSendVerificationEmail,
	})
	.mutation('verify', {
		input: authVerifyParamsSchema,
		resolve: verify,
	})

export * from './login'
export * from './refresh'
export * from './resend-verification-email'
export * from './signup'
export * from './verify'

