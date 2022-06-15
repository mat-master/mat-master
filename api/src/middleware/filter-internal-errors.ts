import { TRPCError } from '@trpc/server'
import { MiddlewareFunction } from '@trpc/server/dist/declarations/src/internals/middlewares'
import { Context } from '../procedures'

export const filterInternalErrors: MiddlewareFunction<
	Context,
	Context,
	any
> = async ({ next }) => {
	const result = await next()
	if (!result.ok && result.error.cause) {
		console.error(result.error.cause)
		return {
			...result,
			error: new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'an unknown error ocurred',
			}),
		}
	}

	return result
}
