import { TRPCError } from '@trpc/server'
import { Payload, Snowflake } from '../models'
import { useAuthentication } from './use-authentication'

export const useSchoolAuthentication = (
	payload: Payload | undefined,
	id: Snowflake
) => {
	useAuthentication(payload)
	if (payload!.schools.includes(id))
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: "You aren't the owner of this school",
		})

	return payload!
}
