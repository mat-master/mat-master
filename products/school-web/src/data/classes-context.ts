import type { ClassTime } from '@common/types'
import { classTimeSchema } from '@common/util/src/validator'
import * as yup from 'yup'
import { createResourceContext, RemoteResource } from './resource-provider'

export interface Class extends RemoteResource {
	name: string
	memberships: string[]
	schedule: ClassTime[]
}

export const classSchema: yup.SchemaOf<Class> = yup.object({
	id: yup.string().required(),
	name: yup.string().required('Required'),
	memberships: yup.array(yup.string().required()).required('Required'),
	schedule: yup.array().of(classTimeSchema),
})

export interface ClassSummary extends RemoteResource {
	name: string
	studentAvatars: Array<string | undefined>
	memberships: Array<string>
	schedule: ClassTime[]
}

export const testClasses = Array<Class>(16).fill({
	id: '483hfewi',
	name: 'TaeKwonDo',
	memberships: ['4893hfueowa'],
	schedule: [
		{ schedule: '0 18 * * 1', duration: 60 },
		{ schedule: '0 18 * * 3', duration: 60 },
	],
})

export const testClassSummaries = Array<ClassSummary>(16).fill({
	id: '483hfewi',
	name: 'TaeKwonDo',
	memberships: Array(3).fill('Basic'),
	schedule: [
		{ schedule: '0 18 * * 1', duration: 60 },
		{ schedule: '0 18 * * 2', duration: 60 },
		{ schedule: '0 18 * * 3', duration: 60 },
		{ schedule: '0 18 * * 4', duration: 60 },
		{ schedule: '0 18 * * 5', duration: 60 },
	],
	studentAvatars: Array(6).fill(undefined),
})

const classesContext = createResourceContext<Class, ClassSummary>()

export default classesContext
