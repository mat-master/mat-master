import { Global, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

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

			<NotificationsProvider>
				<App />
			</NotificationsProvider>
		</MantineProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
import.meta.hot?.accept();
