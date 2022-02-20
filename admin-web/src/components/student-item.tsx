import { ActionIcon, Avatar, Badge, createStyles, Text, Title } from '@mantine/core';
import React from 'react';
import { MoreHorizontal as MoreHorizontalIcon } from 'react-feather';

export interface StudentItemProps {
	name: string;
	avatarUrl?: string | undefined;
	status: 'active' | 'inactive';
	membershipCount: number;
}

const useStyles = createStyles((theme) => ({
	inner: {
		justifyContent: 'left',
	},
}));

const StudentItem: React.FC<StudentItemProps> = ({
	avatarUrl,
	name,
	status,
	membershipCount,
}) => {
	const { classes } = useStyles();

	return (
		// <Button
		// 	classNames={classes}
		// 	variant='default'
		// 	size='lg'
		// 	mb='xs'
		// 	component={Link}
		// 	to='./student'
		// 	fullWidth
		// >

		// </Button>
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'center',
				padding: '6px 12px',
			}}
		>
			<Avatar src={avatarUrl} radius='xl' />
			<Title order={6}>{name}</Title>
			<Badge color='green' variant='outline'>
				{status}
			</Badge>
			<Text>{membershipCount} active memberships</Text>
			<ActionIcon>
				<MoreHorizontalIcon />
			</ActionIcon>
		</div>
	);
};

export default StudentItem;
