import { useMantineTheme } from '@mantine/core';

const usePrimaryColor = () => {
	const theme = useMantineTheme();
	return theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 8 : 5];
};

export default usePrimaryColor;
