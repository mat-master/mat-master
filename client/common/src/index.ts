import type UserRouter from '@mat-master/user_api'
import { createReactQueryHooks } from '@trpc/react'

export const userApi = createReactQueryHooks<UserRouter>()
export const userTrpcClient = userApi.createClient({
	url: 'http://localhost:8080',
})
