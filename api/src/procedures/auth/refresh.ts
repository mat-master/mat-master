import { Procedure } from '..'

export interface AuthRefreshResult {
	jwt: string
}

export const refresh: Procedure<void, AuthRefreshResult> = () => {
	throw 'To do'
}
