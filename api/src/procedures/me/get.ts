import { userRowSchema } from '@mat-master/database'
import { z } from 'zod'
import { Procedure } from '..'
import { privateErrors } from '../../util/private-errors'
import { useAuthentication } from '../../util/use-authentication'

export const getMeResultSchema = userRowSchema.omit({
	password: true,
	stripeCustomerId: true,
})

export type GetMeResult = z.infer<typeof getMeResultSchema>

export const getMe: Procedure<void, GetMeResult> = async ({ ctx, input }) => {
	const payload = useAuthentication(ctx.payload)
	const user = await privateErrors(() =>
		ctx.db.user.findUnique({ where: { id: payload.id }, rejectOnNotFound: true })
	)

	return getMeResultSchema.parse(user)
}
