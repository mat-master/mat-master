import type { LoginPostBody, SignupPostBody } from '@common/types'
import axios from 'axios'
import type { NavigateFunction } from 'react-router'

export const signup = async (data: SignupPostBody) => {
	const res = await axios.post('/auth/signup', data)
	if (res.status !== 200) throw res.data.error
}

export const signin = async (data: LoginPostBody) => {
	const res = await axios.post('/auth/login', data)
	if (res.status !== 200) throw res.data.error

	const { jwt } = res.data
	if (typeof jwt !== 'string') throw undefined

	localStorage.setItem('jwt', jwt)
	axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
}

export const signout = async (navigate?: NavigateFunction) => {
	window.localStorage.removeItem('jwt')
	navigate && navigate('/sign-in')
}

export const verifyEmail = async (token: any) => {
	if (typeof token !== 'string' || !/^[\w-]+\.[\w-]+\.[\w-]+$/.test(token))
		throw 'Invalid Token'

	const res = await axios.post('/auth/verify', { token })
	if (res.status !== 200) throw "Couldn't verify your email"
}
