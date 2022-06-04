import { router } from '@trpc/server'
import { Context } from '../..'
import { schoolClassesRouter } from './classes'
import { createSchool, createSchoolParamsSchema } from './create'
import { getSchool, getSchoolParamsSchema } from './get'
import { schoolInvitesRouter } from './invites'
import { joinSchool, joinSchoolParamsSchema } from './join'
import { schoolMembershipsRouter } from './memberships'
import { studentsRouter } from './students'

export const schoolRouter = router<Context>()
	.query('get', { input: getSchoolParamsSchema, resolve: getSchool })
	.mutation('create', { input: createSchoolParamsSchema, resolve: createSchool })
	.mutation('join', { input: joinSchoolParamsSchema, resolve: joinSchool })
	.merge('classes.', schoolClassesRouter)
	.merge('invites.', schoolInvitesRouter)
	.merge('memberships.', schoolMembershipsRouter)
	.merge('students.', studentsRouter)

export * from './classes'
export * from './create'
export * from './get'
export * from './invites'
export * from './join'
export * from './memberships'
export * from './students'

