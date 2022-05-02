import type { SchoolInvitesPostBody } from '@common/types'
import axios from 'axios'
import getSchoolId from '../utils/get-school-id'

export const createInvite = async (data: SchoolInvitesPostBody) => {
	const res = await axios.post(`/schools/${getSchoolId()}/invites`, data)
}
