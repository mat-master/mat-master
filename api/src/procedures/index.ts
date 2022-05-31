import { InferLast, router as trpcRouter } from '@trpc/server'
import { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { ProcedureResolver } from '@trpc/server/dist/declarations/src/internals/procedure'
import { parseAuthHeader } from '../util/parse-auth-header'
import { authRouter } from './auth'

export type Context = Awaited<ReturnType<typeof createContext>>
export type Result<T = undefined> = { data: T } | { error: any }
export type Procedure<TParams = void, TResult = undefined> = ProcedureResolver<
	Context,
	TParams,
	InferLast<Result<TResult>>
>

export const createContext = ({ req }: CreateExpressContextOptions) => ({
	payload: parseAuthHeader(req.headers.authorization),
})

export const router = trpcRouter<Context>().merge('auth.', authRouter)
