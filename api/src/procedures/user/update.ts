import { userRowSchema } from '@mat-master/database'
import { z } from 'zod'
import { Procedure } from '..'
import { useAuthentication } from '../../util/use-authentication'

export const updateUserParamsSchema = userRowSchema
	.omit({
		id: true,
		password: true,
		stripeCustomerId: true,
		emailVerified: true,
		avatar: true, // Temporary
		email: true,
	})
	.partial()

export type UpdateUserParams = z.infer<typeof updateUserParamsSchema>

export const updateUser: Procedure<UpdateUserParams> = async ({ ctx, input }) => {
	useAuthentication(ctx)
	await ctx.db.user.update({ where: { id: ctx.payload.id }, data: input })
}
