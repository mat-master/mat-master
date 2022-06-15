import { userRowSchema } from '@mat-master/database'
import { z } from 'zod'
import { Procedure } from '..'
import { useAuthentication } from '../../util/use-authentication'

export const getUserResultSchema = userRowSchema.omit({
	password: true,
	stripeCustomerId: true,
})

export type GetUserResult = z.infer<typeof getUserResultSchema>

export const getUser: Procedure<void, GetUserResult> = async ({ ctx }) => {
	useAuthentication(ctx)
	const user = await ctx.db.user.findUnique({
		where: { id: ctx.payload.id },
		rejectOnNotFound: true,
	})

	return getUserResultSchema.parse(user)
}
