import { TRPCError } from '@trpc/server'
import { Payload } from '../models'

export const useAuthentication = (payload?: Payload) => {
	if (!payload)
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'unauthenticated',
		})

	return payload
}
