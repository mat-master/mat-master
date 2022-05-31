import { InferLast, router as trpcRouter } from '@trpc/server'
import { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { ProcedureResolver } from '@trpc/server/dist/declarations/src/internals/procedure'
import { parseAuthHeader } from '../util/parse-auth-header'
import { authRouter } from './auth'
import { userRouter } from './user'

export type Context = Awaited<ReturnType<typeof createContext>>
export type Procedure<TParams = void, TResult = void> = ProcedureResolver<
	Context,
	TParams,
	InferLast<TResult>
>

export const createContext = ({ req }: CreateExpressContextOptions) => ({
	payload: parseAuthHeader(req.headers.authorization),
})

export const router = trpcRouter<Context>()
	.merge('auth.', authRouter)
	.merge('user.', userRouter)
