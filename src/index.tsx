import { MantineProvider } from '@mantine/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app';
import './index.css';

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<MantineProvider theme={{ primaryColor: 'red' }}>
				<App />
			</MantineProvider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
import.meta.hot?.accept();
