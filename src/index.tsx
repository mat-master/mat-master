import { Global, MantineProvider } from '@mantine/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app';

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<MantineProvider theme={{ primaryColor: 'red' }}>
				<Global
					styles={(theme) => ({
						'*': { boxSizing: 'border-box' },
						'body, #root': { margin: 0 },
						body: { backgroundColor: theme.colors.gray[1] },
					})}
				/>
				<App />
			</MantineProvider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
import.meta.hot?.accept();
