import jwt from 'jsonwebtoken'
import { payloadSchema } from '../models'

export const authHeaderPattern = /^Bearer ([\w-]+\.){2}[\w-]+$/

export const parseAuthHeader = (header?: string) => {
	if (!header) return
	if (!authHeaderPattern.test(header)) return

	const token = header.substring(7)
	const result = payloadSchema.safeParse(
		jwt.verify(token, process.env.JWT_SECRET as string)
	)

	if (!result.success) return
	return result.data
}
