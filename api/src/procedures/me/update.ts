import { userRowSchema } from '@mat-master/database'
import { z } from 'zod'
import { Procedure } from '..'
import { db } from '../..'
import { privateErrors } from '../../util/private-errors'
import { useAuthentication } from '../../util/use-authentication'

export const updateMeParamsSchema = userRowSchema.omit({
	id: true,
	password: true,
	privilege: true,
	stripeCustomerId: true,
	avatar: true, // Temporary
})

export type UpdateMeParams = z.infer<typeof updateMeParamsSchema>

export const updateMe: Procedure<UpdateMeParams> = async ({ ctx, input }) => {
	const payload = useAuthentication(ctx)
	await privateErrors(() =>
		db.user.update({ where: { id: payload.id }, data: input })
	)
}
