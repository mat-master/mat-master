import { trpcClient } from '..'
import { InferMutationParams, InferQueryParams } from './trpc'

const TOKEN_KEY = 'jwt'

export const signout = () => {
	localStorage.removeItem(TOKEN_KEY)
	location.reload()
}

export const signin = async (params: InferQueryParams<'auth.login'>) => {
	const { jwt } = await trpcClient.query('auth.login', params)
	localStorage.setItem(TOKEN_KEY, jwt)
}

export const signup = async (params: InferMutationParams<'auth.signup'>) => {
	await trpcClient.mutation('auth.signup', params)
	await signin({ email: params.email, password: params.password })
}

export const getAuthHeader = () => {
	const token = localStorage.getItem(TOKEN_KEY)
	return token ? `Bearer ${token}` : undefined
}
