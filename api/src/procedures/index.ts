import { PrismaClient } from '@prisma/client'
import { InferLast, ProcedureType, router as trpcRouter } from '@trpc/server'
import { CreateExpressContextOptions } from '@trpc/server/adapters/express'
import { ProcedureResolver } from '@trpc/server/dist/declarations/src/internals/procedure'
import Stripe from 'stripe'
import superjson from 'superjson'
import { filterInternalErrors } from '../middleware/filter-internal-errors'
import { logger } from '../middleware/logger'
import { parseAuthHeader } from '../util/parse-auth-header'
import { authRouter } from './auth'
import { schoolRouter } from './school'
import { userRouter } from './user'

export interface BaseContext {
	db: PrismaClient
	stripe: Stripe
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
	.middleware(filterInternalErrors)
	.middleware(logger)
	.transformer(superjson)
	.merge('auth.', authRouter)
	.merge('user.', userRouter)
	.merge('school.', schoolRouter)