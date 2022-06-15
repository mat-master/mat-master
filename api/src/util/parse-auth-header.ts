import { payloadSchema } from '../models'
import { decodeToken } from './payload-encoding'

export const authHeaderPattern = /^Bearer ([\w-]+\.){2}[\w-]+$/

export const parseAuthHeader = (header?: string) => {
	if (!header) return
	if (!authHeaderPattern.test(header)) return

	const token = header.substring(7)
	const result = payloadSchema.safeParse(decodeToken(token))

	if (!result.success) return
	return result.data
}
