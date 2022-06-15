import { TRPCError } from '@trpc/server'
import { Payload } from '../models'
import { Context } from '../procedures'

export function useAuthentication(
	ctx: Context
): asserts ctx is Context & { payload: Payload } {
	if (!ctx.payload)
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'unauthenticated',
		})
}
