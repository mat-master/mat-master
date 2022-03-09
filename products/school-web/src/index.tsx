import { Global, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app'
import ResourcesProvider from './data/resources-provider'
import SchoolProvider from './data/school-provider'

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
	axios.defaults.baseURL = `http://${window.location.hostname}:3030`
} else {
	axios.defaults.baseURL = 'https://api.matmaster.app'
}

ReactDOM.render(
	<React.StrictMode>
		<MantineProvider theme={{ primaryColor: 'red' }}>
			<Global
				styles={(theme) => ({
					'*': { boxSizing: 'border-box' },
					'body, #root': { margin: 0, width: '100vw', height: '100vh' },
					body: { backgroundColor: theme.colors.gray[1] },
				})}
			/>

			<SchoolProvider>
				<ResourcesProvider>
					<NotificationsProvider>
						<App />
					</NotificationsProvider>
				</ResourcesProvider>
			</SchoolProvider>
		</MantineProvider>
	</React.StrictMode>,
	document.getElementById('root')
)

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
import.meta.hot?.accept();
