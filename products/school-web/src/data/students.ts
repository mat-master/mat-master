import type { SchoolInvitesPostBody, Student } from '@common/types'
import { validator } from '@common/util'
import axios from 'axios'
import * as yup from 'yup'
import getSchoolId from '../utils/get-school-id'

export const inviteStudent = async (data: SchoolInvitesPostBody) => {
	const res = await axios.post(`/schools/${getSchoolId()}/invites`, data)
	if (res.status !== 200) throw res.data.error
}

export const getStudents = async () => {
	const res = await axios.get(`/schools/${getSchoolId()}/students`)
	if (res.status !== 200) throw res.data.error

	return res.data as Student[]
	if (!yup.array().of(validator.studentSchema).validate(res.data)) throw undefined
}

export type StudentData = {
	memberships: string[]
}

export const updateStudent = async (id: string, data: StudentData) => {
	const res = await axios.post(`/schools/${getSchoolId()}/students/${id}`, data)
	if (res.status !== 200) throw res.data.error
}
