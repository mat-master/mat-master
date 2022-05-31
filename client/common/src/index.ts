import type { router } from '@mat-master/api'
import { createReactQueryHooks } from '@trpc/react'

export const userApi = createReactQueryHooks<typeof router>()
export const userTrpcClient = userApi.createClient({
	url: 'http://localhost:8080',
})
