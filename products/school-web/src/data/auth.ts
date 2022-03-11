import type { LoginPostBody, SignupPostBody, User } from '@common/types'
import { validator } from '@common/util'
import axios from 'axios'

export const signup = async (data: SignupPostBody) => {
	const res = await axios.post('/auth/signup', data)
	if (res.status !== 200) throw Error(res.data.error)
}

export const signin = async (data: LoginPostBody) => {
	const res = await axios.post('/auth/login', data)
	if (res.status !== 200) throw Error(res.data.error)

	const { jwt } = res.data
	if (typeof jwt !== 'string') throw undefined

	localStorage.setItem('jwt', jwt)
	axios.defaults.headers.common['Authorization'] = `Bearer ${jwt}`
}

export const getUser = async () => {
	const jwt = window.localStorage.getItem('jwt')
	if (!jwt) throw 'Unauthenticated'

	const res = await axios.get('/users/me')
	if (res.status !== 200) throw res.data.error

	const user = validator.userSchema.cast(res.data)
	if (!validator.userSchema.validate(user)) throw undefined

	return user as User
}