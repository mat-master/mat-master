import { InferLast, router as trpcRouter } from '@trpc/server'
import { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { ProcedureResolver } from '@trpc/server/dist/declarations/src/internals/procedure'
import { parseAuthHeader } from '../util/parse-auth-header'
import { authRouter } from './auth'
import { schoolRouter } from './school'
import { userRouter } from './user'

export const createContext = ({ req }: CreateExpressContextOptions) => ({
	payload: parseAuthHeader(req.headers.authorization),
})

export type Context = Awaited<ReturnType<typeof createContext>>
export type Procedure<TParams = void, TResult = void> = ProcedureResolver<
	Context,
	TParams,
	InferLast<TResult>
>

export const router = trpcRouter<Context>()
	.merge('auth.', authRouter)
	.merge('user.', userRouter)
	.merge('school.', schoolRouter)

export * from './auth'
export * from './kiosk'
export * from './user'

