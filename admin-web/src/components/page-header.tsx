import { ActionIcon, Box, Group, TextInput, Title } from '@mantine/core';
import React from 'react';
import { Search } from 'react-feather';

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

const PageHeader: React.FC<PageHeaderProps> = ({ title, search, actions }) => {
	return (
		<Box component='header' mb='md'>
			<Group position='apart' align='center'>
				<Title>{title}</Title>

				<Group spacing='sm' align='center'>
					{actions?.map(({ icon, action, label }, i) => (
						<ActionIcon key={i} size='lg' color='red' variant='filled' onClick={action}>
							{icon}
						</ActionIcon>
					))}

					{search && (
						<TextInput
							style={{ width: '32ch' }}
							icon={<Search size={18} />}
							placeholder='Search...'
							onChange={(e) => search(e.target.value)}
						/>
					)}
				</Group>
			</Group>
		</Box>
	);
};

export default PageHeader;
