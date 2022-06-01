import { Context } from '../procedures'

export const useAuthentication = (ctx: Context) => {
	if (!ctx.payload) throw 'Unauthenticated'
	return ctx.payload
}
