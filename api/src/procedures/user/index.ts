import { router } from '@trpc/server'
import { z } from 'zod'
import { Context } from '..'
import { snowflakeSchema } from '../../models'
import { get, userGetParamsSchema } from './get'
import { userInvitesRouter } from './invites'
import { userSchoolsRouter } from './schools'
import { update, userUpdateParamsSchema } from './update'

export const userIdParamSchema = z.union([snowflakeSchema, z.literal('me')])

export const userRouter = router<Context>()
	.query('get', { input: userGetParamsSchema, resolve: get })
	.mutation('update', { input: userUpdateParamsSchema, resolve: update })
	.merge('invites.', userInvitesRouter)
	.merge('schools.', userSchoolsRouter)
