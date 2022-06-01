import { Global, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'
import { router } from '@mat-master/api'
import { createReactQueryHooks } from '@trpc/react'
import React from 'react'
import ReactDOM from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from './app'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: { refetchOnWindowFocus: false, retry: false, refetchOnMount: false },
		mutations: { retry: false },
	},
})

export const trpc = createReactQueryHooks<typeof router>()
const trpcClient = trpc.createClient({
	url: 'http://localhost:8080',
})

ReactDOM.render(
	<React.StrictMode>
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				<MantineProvider
					theme={{
						primaryColor: 'red',
						fontFamily: "'Lato', sans-serif",
						headings: { fontFamily: "'Lato', sans-serif", fontWeight: 900 },
					}}
				>
					<Global
						styles={(theme) => ({
							'*, *::before, *::after': { boxSizing: 'border-box' },
							'body, #root': { margin: 0, width: '100vw', height: '100vh' },
							body: {
								backgroundColor: theme.colors.gray[1],
								...theme.fn.fontStyles(),
							},
						})}
					/>

					<NotificationsProvider>
						<ModalsProvider labels={{ confirm: "Yes, I'm Sure", cancel: 'Cancel' }}>
							<App />
						</ModalsProvider>
					</NotificationsProvider>
				</MantineProvider>
			</QueryClientProvider>
		</trpc.Provider>
	</React.StrictMode>,
	document.getElementById('root')
)

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
import.meta.hot?.accept();
