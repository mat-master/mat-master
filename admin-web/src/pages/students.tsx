import { createStyles, Paper, ScrollArea } from '@mantine/core';
import React from 'react';
import StudentItem from '../components/student-item';

const useStyles = createStyles((theme) => ({
	root: { height: '100%' },
	viewport: { padding: theme.spacing.md },
}));

const StudentsPage: React.FC = () => {
	const { classes } = useStyles();
	const students = Array(16).fill({ name: 'John Doe', status: 'active', membershipCount: 1 });

	return (
		<Paper>
			<ScrollArea classNames={classes}>
				{students.map((student, i) => (
					<StudentItem key={i} {...student} />
				))}
			</ScrollArea>
		</Paper>
	);
};

export default StudentsPage;
