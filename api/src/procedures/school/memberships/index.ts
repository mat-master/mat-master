import { router } from '@trpc/server'
import { Context } from '../..'
import {
	createSchoolMembership,
	createSchoolMembershipParamsSchema,
} from './create'
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
	.query('all.get', {
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


export * from './create'
export * from './get'
export * from './get-all'
export * from './update'

