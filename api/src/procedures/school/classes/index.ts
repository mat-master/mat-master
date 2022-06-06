import { router } from '@trpc/server'
import { Context } from '../..'
import { createSchoolClass, createSchoolClassParamsSchema } from './create'
import { getSchoolClass, getSchoolClassParamsSchema } from './get'
import { getAllSchoolClasses, getAllSchoolClassesParamsSchema } from './get-all'
import { updateSchoolClass, updateSchoolClassParamsSchema } from './update'

export const schoolClassesRouter = router<Context>()
	.query('get', {
		input: getSchoolClassParamsSchema,
		resolve: getSchoolClass,
	})
	.query('all.get', {
		input: getAllSchoolClassesParamsSchema,
		resolve: getAllSchoolClasses,
	})
	.mutation('create', {
		input: createSchoolClassParamsSchema,
		resolve: createSchoolClass,
	})
	.mutation('update', {
		input: updateSchoolClassParamsSchema,
		resolve: updateSchoolClass,
	})

export * from './create'
export * from './get'
export * from './get-all'
export * from './update'

