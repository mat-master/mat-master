import { ActionIcon, Avatar, Badge, Box, createStyles, Menu, Text, Title } from '@mantine/core';
import React from 'react';
import { Edit2 as EditIcon, MoreHorizontal as MoreHorizontalIcon } from 'react-feather';

const useStyles = createStyles((theme) => ({
	item: {
		display: 'grid',
		gridTemplateColumns: '56px 2fr 1fr 3fr 56px',
		alignItems: 'center',
		justifyItems: 'start',
		columnGap: theme.spacing.sm,
		padding: `6px ${theme.spacing.lg}px`,
		borderBottom: `1px solid ${theme.colors.gray[2]}`,
	},
	heaad: {
		paddingTop: theme.spacing.md,
		paddingBottom: theme.spacing.md,
	},
}));

export const StudentsTableHead: React.FC = () => {
	const { classes } = useStyles();

	return (
		<Box className={`${classes.item} ${classes.heaad}`}>
			<div />
			<Title order={5}>Name</Title>
			<Title order={5}>Status</Title>
			<Title order={5}>Memberships</Title>
			<div />
		</Box>
	);
};

export interface StudentTableItemProps {
	name: string;
	avatarUrl?: string | undefined;
	status: 'active' | 'inactive';
	membershipCount: number;
	openEdit: VoidFunction;
}

export const StudentTableItem: React.FC<StudentTableItemProps> = ({
	avatarUrl,
	name,
	status,
	membershipCount,
	openEdit,
}) => {
	const { classes } = useStyles();

	return (
		<Box className={classes.item}>
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
