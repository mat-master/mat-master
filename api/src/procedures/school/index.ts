import { router } from '@trpc/server'
import { Context } from '../..'
import { schoolClassesRouter } from './classes'
import { createSchool, createSchoolParamsSchema } from './create'
import { getSchool, getSchoolParamsSchema } from './get'
import { joinSchool, joinSchoolParamsSchema } from './join'

export const schoolRouter = router<Context>()
	.query('get', { input: getSchoolParamsSchema, resolve: getSchool })
	.mutation('create', { input: createSchoolParamsSchema, resolve: createSchool })
	.mutation('join', { input: joinSchoolParamsSchema, resolve: joinSchool })
	.merge(schoolClassesRouter)
