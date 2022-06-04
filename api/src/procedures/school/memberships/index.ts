import { router } from '@trpc/server'
import { Context } from '../..'
import {
	createSchoolMembership,
	createSchoolMembershipParamsSchema,
} from './create'
import {
	deleteSchoolMembership,
	deleteSchoolMembershipParamsSchema,
} from './delete'
import { getSchoolMembership, getSchoolMembershipParamsSchema } from './get'
import {
	updateSchoolMembership,
	updateSchoolMembershipParamsSchema,
} from './update'

export const schoolMembershipsRouter = router<Context>()
	.query('get', {
		input: getSchoolMembershipParamsSchema,
		resolve: getSchoolMembership,
	})
	.mutation('create', {
		input: createSchoolMembershipParamsSchema,
		resolve: createSchoolMembership,
	})
	.mutation('update', {
		input: updateSchoolMembershipParamsSchema,
		resolve: updateSchoolMembership,
	})
	.mutation('delete', {
		input: deleteSchoolMembershipParamsSchema,
		resolve: deleteSchoolMembership,
	})
