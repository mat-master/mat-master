import type { User, UserPatchBody } from '@common/types'
import { validator } from '@common/util'
import axios from 'axios'

export const getUser = async () => {
	const jwt = window.localStorage.getItem('jwt')
	if (!jwt) throw 'Unauthenticated'

	const res = await axios.get('/users/me')
	if (res.status !== 200) throw res.data.error

	const user = validator.userSchema.cast(res.data)
	if (!validator.userSchema.validate(user)) throw undefined

	return user as User
}

export const updateUser = async (data: UserPatchBody) => {
	const res = await axios.patch('/users/me', data)
	if (res.status !== 200) throw res.data.error
}
