import { MiddlewareFunction } from '@trpc/server/dist/declarations/src/internals/middlewares'
import { Context } from '../procedures'

export const logger: MiddlewareFunction<Context, Context, any> = async ({
	next,
	type,
	path,
}) => {
	const start = Date.now()
	const result = await next()
	const duration = Date.now() - start

	result.ok
		? console.log(`OK: ${type} ${path} ${duration}ms`)
		: console.log(`ERROR: ${type} ${path} ${duration}ms`)

	return result
}
