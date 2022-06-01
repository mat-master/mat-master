import { router } from '@trpc/server'
import { z } from 'zod'
import { Context } from '..'
import { snowflakeSchema } from '../../models'
import { getUser, userGetParamsSchema } from './get'
import { userInvitesRouter } from './invites'
import { userSchoolsRouter } from './schools'
import { updateUser, userUpdateParamsSchema } from './update'

export const userIdParamSchema = z.union([snowflakeSchema, z.literal('me')])

export const userRouter = router<Context>()
	.query('get', { input: userGetParamsSchema, resolve: getUser })
	.mutation('update', { input: userUpdateParamsSchema, resolve: updateUser })
	.merge('invites.', userInvitesRouter)
	.merge('schools.', userSchoolsRouter)

export * from './get'
export * from './invites'
export * from './schools'
export * from './update'

