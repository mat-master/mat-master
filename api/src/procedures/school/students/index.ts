import { router } from '@trpc/server'
import { Context } from '../..'
import { getSchoolStudent, getSchoolStudentParamsSchema } from './get'
import { getAllSchoolStudents, getAllSchoolStudentsParamsSchema } from './get-all'

export const studentsRouter = router<Context>()
	.query('get', {
		input: getSchoolStudentParamsSchema,
		resolve: getSchoolStudent,
	})
	.query('all.get', {
		input: getAllSchoolStudentsParamsSchema,
		resolve: getAllSchoolStudents,
	})

export * from './get'
export * from './get-all'

