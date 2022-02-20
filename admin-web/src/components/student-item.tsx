import { ActionIcon, Avatar, Badge, Box, Menu, Text, Title } from '@mantine/core';
import React from 'react';
import { Edit2 as EditIcon, MoreHorizontal as MoreHorizontalIcon } from 'react-feather';

export interface StudentItemProps {
	name: string;
	avatarUrl?: string | undefined;
	status: 'active' | 'inactive';
	membershipCount: number;
	openEdit: VoidFunction;
}

const StudentItem: React.FC<StudentItemProps> = ({
	avatarUrl,
	name,
	status,
	membershipCount,
	openEdit,
}) => {
	return (
		<Box
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				padding: '6px 12px 6px 24px',
			}}
		>
			<Avatar src={avatarUrl} radius='xl' />
			<Title order={6}>{name}</Title>
			<Badge color='green' variant='outline'>
				{status}
			</Badge>
			<Text>{membershipCount} active memberships</Text>
			<Menu
				gutter={2}
				control={
					<ActionIcon size='lg'>
						<MoreHorizontalIcon size={18} />
					</ActionIcon>
				}
			>
				<Menu.Item icon={<EditIcon size={16} />} onClick={openEdit}>
					Edit
				</Menu.Item>
			</Menu>
		</Box>
	);
};

export default StudentItem;
