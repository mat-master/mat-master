import { userRowSchema } from '@mat-master/database'
import { z } from 'zod'
import { Procedure } from '..'
import { useAuthentication } from '../../util/use-authentication'

export const getUserResultSchema = userRowSchema.omit({
	password: true,
	stripeCustomerId: true,
})

export type GetUserResult = z.infer<typeof getUserResultSchema>

export const getUser: Procedure<void, GetUserResult> = async ({ ctx, input }) => {
	const payload = useAuthentication(ctx.payload)
	const user = await ctx.db.user.findUnique({
		where: { id: payload.id },
		rejectOnNotFound: true,
	})

	return getUserResultSchema.parse(user)
}
