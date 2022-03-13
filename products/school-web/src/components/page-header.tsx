import { ActionIcon, Box, Group, Title, useMantineTheme } from '@mantine/core';
import type React from 'react';
import type { Icon } from 'tabler-icons-react'
import SearchBar from './search-bar'

export interface Action {
	icon: Icon
	action: VoidFunction
	label?: string
}

export interface PageHeaderProps {
	title: string
	actions?: Action[]
	search?: ((term: string) => void) | undefined
	searchTerm?: string
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, actions, search, searchTerm }) => {
	const theme = useMantineTheme()

	return (
		<Box component='header'>
			<Group position='apart' align='center'>
				<Title>{title}</Title>

				<Group spacing='sm' align='center'>
					{actions?.map(({ icon: Icon, action }, i) => (
						<ActionIcon
							key={i}
							size='lg'
							color={theme.primaryColor}
							variant='filled'
							onClick={action}
						>
							{<Icon size={18} />}
						</ActionIcon>
					))}

					{search && <SearchBar onChange={(e) => search(e.target.value)} value={searchTerm} />}
				</Group>
			</Group>
		</Box>
	)
}

export default PageHeader;
