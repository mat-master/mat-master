import { router } from '@trpc/server'
import { Context } from '../..'
import { createSchoolClass, createSchoolClassParamsSchema } from './create'
import { deleteSchoolClass, deleteSchoolClassParamsSchema } from './delete'
import { getSchoolClass, getSchoolClassParamsSchema } from './get'
import { updateSchoolClass, updateSchoolClassParamsSchema } from './update'

export const schoolClassesRouter = router<Context>()
	.query('get', {
		input: getSchoolClassParamsSchema,
		resolve: getSchoolClass,
	})
	.mutation('create', {
		input: createSchoolClassParamsSchema,
		resolve: createSchoolClass,
	})
	.mutation('update', {
		input: updateSchoolClassParamsSchema,
		resolve: updateSchoolClass,
	})
	.mutation('delete', {
		input: deleteSchoolClassParamsSchema,
		resolve: deleteSchoolClass,
	})
