import { PrismaClient } from '@prisma/client'
import { InferLast, ProcedureType, router as trpcRouter } from '@trpc/server'
import { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { ProcedureResolver } from '@trpc/server/dist/declarations/src/internals/procedure'
import { parseAuthHeader } from '../util/parse-auth-header'
import { authRouter } from './auth'
import { meRouter } from './me'
import { schoolRouter } from './school'

export interface BaseContext {
	db: PrismaClient
	env: {
		JWT_SECRET: string
	}
}

export const createContextConstructor =
	(baseCtx: BaseContext) =>
	({ req }: CreateExpressContextOptions) => ({
		...baseCtx,
		payload: parseAuthHeader(req.headers.authorization),
	})

export type Context = ReturnType<ReturnType<typeof createContextConstructor>>
export type Procedure<TParams = void, TResult = void> = ProcedureResolver<
	Context,
	TParams,
	InferLast<TResult>
>

export type ProcedureData<P> = {
	ctx: Context
	input: P
	type: ProcedureType
}

export const router = trpcRouter<Context>()
	.merge('auth.', authRouter)
	.merge('me.', meRouter)
	.merge('school.', schoolRouter)

export * from './auth'
export * from './kiosk'
export * from './me'
export * from './school'
