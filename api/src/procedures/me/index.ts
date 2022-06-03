import { router } from '@trpc/server'
import { Context } from '..'
import { getMe } from './get'
import { userInvitesRouter } from './invites'
import { userSchoolsRouter } from './schools'
import { updateMe, updateMeParamsSchema } from './update'

export const meRouter = router<Context>()
	.query('get', { resolve: getMe })
	.mutation('update', { input: updateMeParamsSchema, resolve: updateMe })
	.merge('invites.', userInvitesRouter)
	.merge('schools.', userSchoolsRouter)

export * from './get'
export * from './invites'
export * from './schools'
export * from './update'
