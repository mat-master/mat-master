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
	getAllSchoolMemberships,
	getAllSchoolMembershipsParamsSchema,
} from './get-all'
import {
	updateSchoolMembership,
	updateSchoolMembershipParamsSchema,
} from './update'

export const schoolMembershipsRouter = router<Context>()
	.query('get', {
		input: getSchoolMembershipParamsSchema,
		resolve: getSchoolMembership,
	})
	.query('getAll', {
		input: getAllSchoolMembershipsParamsSchema,
		resolve: getAllSchoolMemberships,
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

	export * from './create'
	export * from './delete'
	export * from './get'
	export * from './get-all'
	export * from './update'
