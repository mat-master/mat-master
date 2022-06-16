import { TRPCError } from '@trpc/server'
import { Payload, Snowflake } from '../models'
import { Context } from '../procedures'
import { useAuthentication } from './use-authentication'

export function useSchoolAuthentication(
	ctx: Context,
	id: Snowflake
): asserts ctx is Context & { payload: Payload } {
	useAuthentication(ctx)
	if (!ctx.payload.schools.includes(id))
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: "You aren't the owner of this school",
		})
}


