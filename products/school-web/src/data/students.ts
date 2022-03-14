import type { SchoolInvitesPostBody, Student } from '@common/types'
import { validator } from '@common/util'
import axios from 'axios'
import * as yup from 'yup'
import getSchoolId from '../utils/get-school-id'

export const inviteStudent = async (data: SchoolInvitesPostBody) => {
	const schoolId = getSchoolId()
	if (!schoolId) throw "Error getting the current school's id"
	const res = await axios.post(`/schools/${schoolId}/invites`, data)
	if (res.status !== 200) throw res.data.error
}

export const getStudents = async () => {
	const schoolId = getSchoolId()
	if (!schoolId) throw "Error getting the current school's id"
	const res = await axios.get(`/schools/${schoolId}/students`)
	if (res.status !== 200) throw res.data.error

	return res.data as Student[]
	if (!yup.array().of(validator.studentSchema).validate(res.data)) throw undefined
}
