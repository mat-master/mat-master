import type { Student } from '@common/types'
import { validator } from '@common/util'
import axios from 'axios'
import * as yup from 'yup'
import getSchoolId from '../utils/get-school-id'

export const temporaryStudentPostSchema = yup
	.object({
		memberships: yup.array().of(yup.string().required()),
	})
	.required()

export type TemporaryStudentPostBody = yup.TypeOf<typeof temporaryStudentPostSchema>

export const getStudents = async () => {
	const res = await axios.get(`/schools/${getSchoolId()}/students`)
	if (res.status !== 200) throw res.data.error

	return res.data as Student[]
	if (!yup.array().of(validator.studentSchema).validate(res.data)) throw undefined
}

export const getStudent = async (id: string) => {
	const res = await axios.get(`schools/${getSchoolId()}/students/${id}`)
	if (res.status !== 200) throw res.data.error

	return res.data as Student
}

export const updateStudent = async (id: string, data: TemporaryStudentPostBody) => {
	const res = await axios.patch(`/schools/${getSchoolId()}/students/${id}`, data)
	if (res.status !== 200) throw res.data.error
}
