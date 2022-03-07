import { Box, Title } from '@mantine/core';
import type React from 'react';
import { useContext } from 'react'
import { schoolContext } from '../data/school-provider'

const AppHeader: React.FC = () => {
	const school = useContext(schoolContext)

	return (
		<Box
			component='header'
			sx={(theme) => ({
				gridColumn: 'span 2',
				padding: `${theme.spacing.md}px ${theme.spacing.xl}px`,
				backgroundColor: theme.white,
				borderBottom: `1px solid ${theme.colors.gray[2]}`,
			})}
		>
			<Title order={3}>{school.name ?? 'Mat Master'}</Title>
		</Box>
	)
}

export default AppHeader;
