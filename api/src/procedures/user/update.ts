import { userRowSchema } from '@mat-master/database'
import { z } from 'zod'
import { userIdParamSchema } from '.'
import { Procedure } from '..'
import { db } from '../..'

export const userUpdateParamsSchema = z.object({
	id: userIdParamSchema,
	data: userRowSchema.omit({
		id: true,
		password: true,
		privilege: true,
		stripeCustomerId: true,
		avatar: true, // Temporary
	}),
})

export type UserUpdateParams = z.infer<typeof userUpdateParamsSchema>

export const updateUser: Procedure<UserUpdateParams> = async ({ ctx, input }) => {
	const uid = input.id === 'me' ? ctx.payload?.id : input.id
	if (!uid) throw 'Invalid user id'
	await db.user.update({ where: { id: uid }, data: input.data })
}
