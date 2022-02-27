import type { MantineTheme } from '@mantine/core';

export const getPrimaryColor = (theme: MantineTheme) =>
	theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 8 : 5];

export const getHighlightColor = (theme: MantineTheme) =>
	theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0];
