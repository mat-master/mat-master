import type { UserBillingPostResponse } from '@common/types'
import axios, { AxiosResponse } from 'axios'

export const createSetupIntent = async () => {
	const res: AxiosResponse<UserBillingPostResponse> = await axios.post(
		'/users/me/billing'
	)
	if (res.status !== 200) throw res.data
	return res.data
}
