import type { SchoolInvitesPostBody } from '@common/types'
import axios from 'axios'

export const inviteStudent = async (data: SchoolInvitesPostBody, schoolId: string) => {
	const res = await axios.post(`/schools/${schoolId}/invites`, data)
	if (res.status !== 200) throw res.data.error
}
