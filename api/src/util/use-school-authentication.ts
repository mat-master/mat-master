import { Payload, Snowflake } from '../models'
import { useAuthentication } from './use-authentication'

export const useSchoolAuthentication = (
	_payload: Payload | undefined,
	id: Snowflake
) => {
	const payload = useAuthentication(_payload)
	if (!payload.schools.includes(id)) throw "You aren't the owner of this school"
	return payload
}
