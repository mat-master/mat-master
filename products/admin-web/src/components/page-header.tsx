import { ActionIcon, Box, Group, Title, useMantineTheme } from '@mantine/core';
import type React from 'react';
import SearchBar from './search-bar';

export interface Action {
	icon: React.ReactNode;
	action: VoidFunction;
	label?: string;
}

export interface PageHeaderProps {
	title: string;
	actions?: Action[];
	search?: ((term: string) => void) | undefined;
	searchTerm?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, actions, search, searchTerm }) => {
	const theme = useMantineTheme();

	return (
		<Box component='header' mb='md'>
			<Group position='apart' align='center'>
				<Title>{title}</Title>

				<Group spacing='sm' align='center'>
					{actions?.map(({ icon, action }, i) => (
						<ActionIcon
							key={i}
							size='lg'
							color={theme.primaryColor}
							variant='filled'
							onClick={action}
						>
							{icon}
						</ActionIcon>
					))}

					{search && <SearchBar onChange={(e) => search(e.target.value)} value={searchTerm} />}
				</Group>
			</Group>
		</Box>
	);
};

export default PageHeader;
