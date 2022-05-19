import type {
	LoginPostBody,
	RefreshPostResponse,
	SignupPostBody,
	UserGetResponse,
	VerifyPostBody,
} from '@common/types'
import axios, { AxiosResponse } from 'axios'
import type { QueryClient } from 'react-query'
import type { NavigateFunction } from 'react-router'

const setJwt = (token: string) => {
	if (!/^([\w-]+\.){2}[\w-]+$/.test(token)) throw 'Invalid Jwt'
	localStorage.setItem('jwt', token)
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export const signin = async (data: LoginPostBody) => {
	const res = await axios.post('/auth/login', data)
	if (res.status !== 200) throw res.data.error

	const { jwt } = res.data
	if (typeof jwt !== 'string') throw undefined
	setJwt(jwt)
}

export const signup = async (data: SignupPostBody) => {
	const res = await axios.post('/auth/signup', data)
	if (res.status !== 200) throw res.data.error
	await signin(data)
}

export const signout = async ({
	navigate,
	queryClient,
}: {
	navigate?: NavigateFunction
	queryClient?: QueryClient
}) => {
	window.localStorage.removeItem('jwt')
	queryClient?.removeQueries(['users', { id: 'me' }])
	if (navigate) navigate('/sign-in')
}

export const sendVerificationEmail = async () => {
	const res: AxiosResponse = await axios.post('/users/me/verify')
	if (res.status !== 200) throw res.data
}

export const verifyEmail = async (data: VerifyPostBody) => {
	const res = await axios.post('/auth/verify', data)
	if (res.status !== 200) throw res.data

	const jwt = res.data?.jwt
	if (jwt) setJwt(jwt)
}

export const checkEmailVerification = async () => {
	const refreshRes: AxiosResponse<RefreshPostResponse> = await axios.post(
		'/auth/refresh'
	)
	if (refreshRes.status !== 200) throw 'An unknown error ocurred'
	setJwt(refreshRes.data.jwt)

	const meRes: AxiosResponse<UserGetResponse> = await axios.get('/users/me')
	if (meRes.status !== 200) throw 'An unknown error ocurred'

	return !!meRes.data.privilege
}