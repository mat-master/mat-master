import type { SchoolClassesGetResponse } from '@common/types'
import axios from 'axios'
import getSchoolId from '../utils/get-school-id'

export const getClasses = async () => {
	const schoolId = getSchoolId()
	if (!schoolId) throw "Error getting the current school's id"
	const res = await axios.get(`/schools/${schoolId}/classes`)
	if (res.status !== 200) throw res.data.error

	return res.data as SchoolClassesGetResponse
}
