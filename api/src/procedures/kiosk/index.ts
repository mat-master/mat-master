import { router } from '@trpc/server'
import { Context } from '..'
import { loginKiosk, loginKioskParams } from './login'

export const kioskRouter = router<Context>().query('login', {
	input: loginKioskParams,
	resolve: loginKiosk,
})

export * from './login'
