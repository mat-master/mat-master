import type { User, UserPatchBody } from '@common/types'
import { validator } from '@common/util'
import axios from 'axios'

export const getUser = async (id = 'me') => {
	const jwt = window.localStorage.getItem('jwt')
	if (!jwt) throw 'Unauthenticated'

	const res = await axios.get(`/users/${id}`)
	if (res.status !== 200) throw res.data.error

	const user = validator.userSchema.cast(res.data)
	if (!validator.userSchema.validate(user)) throw undefined

	return user as User
}

export const updateUser = async (data: UserPatchBody, id = 'me') => {
	const res = await axios.patch(`/users/${id}`, data)
	if (res.status !== 200) throw res.data.error
}
