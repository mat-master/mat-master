import { router } from '@trpc/server'
import { Context } from '..'
import { getUser } from './get'
import { getUserInvites } from './get-invites'
import { getUserSchools } from './get-schools'
import { updateUser, updateUserParamsSchema } from './update'

export const userRouter = router<Context>()
	.query('get', { resolve: getUser })
	.query('invites.get', { resolve: getUserInvites })
	.query('schools.get', { resolve: getUserSchools })
	.mutation('update', { input: updateUserParamsSchema, resolve: updateUser })
