import React from 'react'
import ReactDOM from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter } from 'react-router-dom'
import superjson from 'superjson'
import App from './app'
import { getAuthHeader } from './utils/auth'
import { hashQueryKey } from './utils/hash-query-key'
import { trpc } from './utils/trpc'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: false,
			refetchOnMount: false,
			queryKeyHashFn: hashQueryKey,
		},
		mutations: { retry: false },
	},
})

export const trpcClient = trpc.createClient({
	url: 'http://localhost:8080/trpc',
	transformer: superjson,
	headers: () => ({ authorization: getAuthHeader() }),
})

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<trpc.Provider client={trpcClient} queryClient={queryClient}>
				<QueryClientProvider client={queryClient}>
					<App />
				</QueryClientProvider>
			</trpc.Provider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
)
