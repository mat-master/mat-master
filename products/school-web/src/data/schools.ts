import type {
	School,
	SchoolJoinPostResponse,
	SchoolPostBody,
	UserSchoolsGetResponse,
} from '@common/types'
import { validator } from '@common/util'
import axios, { AxiosResponse } from 'axios'
import * as yup from 'yup'
import getSchoolId from '../utils/get-school-id'

const userSchoolsGetResponseSchema: yup.SchemaOf<UserSchoolsGetResponse> =
	yup.object({
		adminSchools: yup.array().of(validator.schoolSchema).required(),
		studentSchools: yup.array().of(validator.schoolSchema).required(),
	})

export const getSchools = async () => {
	const res = await axios.get('/users/me/schools')
	if (res.status !== 200) throw res.data.error

	// if (!(await userSchoolsGetResponseSchema.validate(res.data))) throw undefined
	return res.data as UserSchoolsGetResponse
}

export const getCurrentSchool = async () => {
	const schoolId = getSchoolId()
	if (!schoolId) return undefined
	const res = await axios.get(`/schools/${schoolId}`)
	if (res.status !== 200) throw res.data.error

	// if (!(await validator.schoolSchema.validate(res.data))) throw undefined
	return res.data as School
}

export const createSchool = async (data: SchoolPostBody) => {
	const res = await axios.post('/schools', data)
	if (res.status !== 200) throw res.data.error
}

export const joinSchool = async (id: string) => {
	const res: AxiosResponse<SchoolJoinPostResponse> = await axios.post(
		`/schools/${id}/join`
	)
	if (res.status !== 200) throw res.data
}
