import { MantineProvider } from '@mantine/core';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

function App({ Component, pageProps }: AppProps) {
	return (
		<MantineProvider theme={{ primaryColor: 'red' }}>
			<Component {...pageProps} />
		</MantineProvider>
	);
}

export default App;
