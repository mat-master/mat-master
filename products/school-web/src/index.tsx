import { Global, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'
import { loadStripe } from '@stripe/stripe-js'
import axios from 'axios'
import React from 'react'
import ReactDOM from 'react-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from './app'

axios.defaults.headers.common.Authorization = `Bearer ${window.localStorage.getItem('jwt')}`
axios.defaults.validateStatus = () => true
axios.defaults.baseURL = // 'https://api.matmaster.app/dev'
	window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
		? `http://${window.location.hostname}:3030`
		: 'https://api.matmaster.app/dev'

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
	</React.StrictMode>,
	document.getElementById('root')
)

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
import.meta.hot?.accept();
