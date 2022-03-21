import type { SchoolMembershipsGetResponse, SchoolMembershipsPostBody } from '@common/types'
import axios from 'axios'
import getSchoolId from '../utils/get-school-id'

export const getMemberships = async () => {
	const res = await axios.get(`/schools/${getSchoolId()}/memberships`)
	if (res.status !== 200) throw res.data.error

	return res.data as SchoolMembershipsGetResponse
}

export const createMembership = async (data: SchoolMembershipsPostBody) => {
	const res = await axios.post(`/schools/${getSchoolId()}/memberships`, data)
	if (res.status !== 200) throw res.data.error
}
