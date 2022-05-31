import { InferLast, router as trpcRouter } from '@trpc/server'
import { ProcedureResolver } from '@trpc/server/dist/declarations/src/internals/procedure'
import { authRouter } from './auth'

export type Result<T = undefined> = { data: T } | { error: any }
export type Procedure<TParams = void, TResult = undefined> = ProcedureResolver<
	unknown,
	TParams,
	InferLast<Result<TResult>>
>

export const router = trpcRouter().merge('auth.', authRouter)
