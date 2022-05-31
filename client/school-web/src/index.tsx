import { Global, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'
import { userApi, userTrpcClient } from '@mat-master/client'
import { loadStripe } from '@stripe/stripe-js'
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

const stripePromise = loadStripe(
	'pk_test_51JetjJGsHxGKM7KBPLMtSBtvx9DrWf1We61NLq9Jxq15a8L0zixNQAG72uyTA8EYEawIwEuJfNeacAd3SbUDgGwi00JC8U6MAI'
)

ReactDOM.render(
	<React.StrictMode>
		<userApi.Provider client={userTrpcClient} queryClient={queryClient}>
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
		</userApi.Provider>
	</React.StrictMode>,
	document.getElementById('root')
)

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
import.meta.hot?.accept();
