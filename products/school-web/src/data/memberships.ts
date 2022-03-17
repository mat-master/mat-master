import type { SchoolMembershipsGetResponse } from '@common/types'
import axios from 'axios'
import getSchoolId from '../utils/get-school-id'

export const getMemberships = async () => {
	const schoolId = getSchoolId()
	if (!schoolId) throw "Error getting the current school's id"
	const res = await axios.get(`/schools/${schoolId}/memberships`)
	if (res.status !== 200) throw res.data.error

	return res.data as SchoolMembershipsGetResponse
}
