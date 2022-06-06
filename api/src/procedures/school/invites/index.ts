import { router } from '@trpc/server'
import { Context } from '../..'
import { createSchoolInvite, createSchoolInviteParamsSchema } from './create'
import { deleteSchoolInvite, deleteSchoolInviteParamsSchema } from './delete'
import { getAllSchoolInvitesParamsSchema, getSchoolInvites } from './get-all'

export const schoolInvitesRouter = router<Context>()
	.query('all.get', {
		input: getAllSchoolInvitesParamsSchema,
		resolve: getSchoolInvites,
	})
	.mutation('create', {
		input: createSchoolInviteParamsSchema,
		resolve: createSchoolInvite,
	})
	.mutation('delete', {
		input: deleteSchoolInviteParamsSchema,
		resolve: deleteSchoolInvite,
	})

export * from './create'
export * from './delete'
export * from './get-all'

