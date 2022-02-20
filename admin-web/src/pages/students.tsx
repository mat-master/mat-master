import { Divider, Paper, ScrollArea } from '@mantine/core';
import React from 'react';
import StudentItem from '../components/student-item';

const StudentsPage: React.FC = () => {
	const students = Array(16).fill({ name: 'John Doe', status: 'active', membershipCount: 1 });

	return (
		<Paper style={{ overflow: 'hidden' }} shadow='md' withBorder>
			<ScrollArea style={{ height: '100%' }} offsetScrollbars>
				{students.map((student, i) => (
					<>
						<StudentItem key={i} {...student} />
						<Divider />
					</>
				))}
			</ScrollArea>
		</Paper>
	);
};

export default StudentsPage;
