import { AuthLoginParams, AuthSignupParams } from '@mat-master/api'
import { trpcClient } from '..'

const TOKEN_KEY = 'jwt'

export const signout = () => {
	localStorage.removeItem(TOKEN_KEY)
	location.reload()
}

export const signin = async (credential: AuthLoginParams) => {
	const { jwt } = await trpcClient.query('auth.login', credential)
	localStorage.setItem(TOKEN_KEY, jwt)
	const headers = await trpcClient.runtime.headers()
}

export const signup = async (data: AuthSignupParams) => {
	await trpcClient.mutation('auth.signup', data)
	await signin({ email: data.email, password: data.password })
}

export const getAuthHeader = () => {
	const token = localStorage.getItem(TOKEN_KEY)
	return token ? `Bearer ${token}` : undefined
}
