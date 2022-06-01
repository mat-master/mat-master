import { userRowSchema } from '@mat-master/database'
import { z } from 'zod'
import { userIdParamSchema } from '.'
import { Procedure } from '..'
import { db } from '../..'
import { useAuthentication } from '../../util/use-authentication'

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
	const payload = useAuthentication(ctx)
	const uid = input.id === 'me' ? payload.id : input.id
	if (uid !== payload.id) throw "You don't have permission to access this resource"
	await db.user.update({ where: { id: uid }, data: input.data })
}
