import { userRowSchema } from '@mat-master/database'
import { z } from 'zod'
import { userIdParamSchema } from '.'
import { Procedure } from '..'
import { db } from '../..'

export const userGetParamsSchema = z.object({
	id: userIdParamSchema,
})

export const userGetResultSchema = userRowSchema.omit({
	password: true,
	stripeCustomerId: true,
})

export type UserGetParms = z.infer<typeof userGetParamsSchema>
export type UserGetResult = z.infer<typeof userGetResultSchema>

export const getUser: Procedure<UserGetParms, UserGetResult> = async ({
	ctx,
	input,
}) => {
	const uid = input.id === 'me' ? ctx.payload?.id : input.id
	if (!uid) throw 'Invalid user id'

	const user = await db.user.findUnique({ where: { id: uid } })
	if (!user) throw 'Not found'
	return userGetResultSchema.parse(user)
}
