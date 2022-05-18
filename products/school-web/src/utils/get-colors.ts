import type { MantineTheme } from '@mantine/core';
//import type { ActivityStatus } from '../data/students-context'

export const getPrimaryColor = (theme: MantineTheme) =>
	theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 8 : 7]

export const getHighlightColor = (theme: MantineTheme) =>
	theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]

export const getStatusColor = (status: any) => {
	switch (status) {
		case 'waiting list':
			return 'blue'
		case 'active':
			return 'green'
		case 'inactive':
			return 'gray'
		case 'deleted':
			return 'red'
	}
}
