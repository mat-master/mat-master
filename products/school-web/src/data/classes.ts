import type { Class, SchoolClassesGetResponse, SchoolClassesPostBody } from '@common/types'
import axios from 'axios'
import getSchoolId from '../utils/get-school-id'

export const getClasses = async () => {
	const res = await axios.get(`/schools/${getSchoolId()}/classes`)
	if (res.status !== 200) throw res.data.error

	return res.data as SchoolClassesGetResponse
}

export const createClass = async (data: SchoolClassesPostBody) => {
	const res = await axios.post(`/schools/${getSchoolId()}/classes`, data)
	if (res.status !== 200) throw res.data.error
}

export const getClass = async (id: string) => {
	const res = await axios.get(`/schools/${getSchoolId()}/classes/${id}`)
	if (res.status !== 200) throw res.data.error

	return res.data as Class
}

export const deleteClass = async (id: string) => {
	const res = await axios.delete(`/schools/${getSchoolId()}/classes/${id}`)
	if (res.status !== 200) throw res.data.error
}
