import { Payload } from '../models'

export const useAuthentication = (payload?: Payload) => {
	if (!payload) throw 'Unauthenticated'
	return payload
}
