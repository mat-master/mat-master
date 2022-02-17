import { Avatar, Badge, Button, createStyles, Text, Title } from '@mantine/core';
import React from 'react';
import { ChevronRight as ChevronRightIcon } from 'react-feather';
import { Link } from 'react-router-dom';

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
		<Button
			classNames={classes}
			variant='default'
			size='lg'
			mb='xs'
			component={Link}
			to='./student'
			fullWidth
		>
			<Avatar src={avatarUrl} radius='xl' />
			<Title order={6}>{name}</Title>
			<Badge color='green' variant='outline'>
				{status}
			</Badge>
			<Text>{membershipCount} active memberships</Text>
			<ChevronRightIcon />
		</Button>
	);
};

export default StudentItem;
