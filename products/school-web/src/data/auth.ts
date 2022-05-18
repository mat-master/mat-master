import type {
	LoginPostBody,
	RefreshPostResponse,
	SignupPostBody,
	UserGetResponse,
} from '@common/types'
import axios, { AxiosResponse } from 'axios'
import type { NavigateFunction } from 'react-router'

export const signin = async (data: LoginPostBody) => {
	const res = await axios.post('/auth/login', data)
	if (res.status !== 200) throw res.data.error

	const { jwt } = res.data
	if (typeof jwt !== 'string') throw undefined

	localStorage.setItem('jwt', jwt)
	axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
}

export const signup = async (data: SignupPostBody) => {
	const res = await axios.post('/auth/signup', data)
	if (res.status !== 200) throw res.data.error
	await signin(data)
}

export const signout = async (navigate?: NavigateFunction) => {
	window.localStorage.removeItem('jwt')
	navigate && navigate('/sign-in')
}

export const sendVerificationEmail = async () => {
	const res = await axios.post('/users/me/verify')
	if (res.status !== 200) throw res.data.error
}

export const verifyEmail = async () => {
	const refreshRes: AxiosResponse<RefreshPostResponse> = await axios.post(
		'/auth/refresh'
	)
	if (refreshRes.status !== 200) throw 'An unknown error ocurred'

	const { jwt } = refreshRes.data
	localStorage.setItem('jwt', jwt)
	axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`

	const meRes: AxiosResponse<UserGetResponse> = await axios.get('/users/me')
	if (meRes.status !== 200) throw 'An unknown error ocurred'

	return !!meRes.data.privilege
}
