import { ActionIcon, Box, Group, Title } from '@mantine/core';
import React from 'react';
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
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, search, actions }) => (
	<Box component='header' mb='md'>
		<Group position='apart' align='center'>
			<Title>{title}</Title>

			<Group spacing='sm' align='center'>
				{actions?.map(({ icon, action, label }, i) => (
					<ActionIcon key={i} size='lg' color='red' variant='filled' onClick={action}>
						{icon}
					</ActionIcon>
				))}

				{search && <SearchBar onChange={(e) => search(e.target.value)} />}
			</Group>
		</Group>
	</Box>
);

export default PageHeader;
