import type { SchoolClassesGetResponse, SchoolClassesPostBody } from '@common/types'
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
