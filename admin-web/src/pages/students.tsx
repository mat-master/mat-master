import { ScrollArea } from '@mantine/core';
import React from 'react';
import StudentItem from '../components/student-item';

const StudentsPage: React.FC = () => {
	const students = Array(16).fill({ name: 'John Doe', status: 'active', membershipCount: 1 });

	return (
		<ScrollArea style={{ width: '100%', maxHeight: '100%' }}>
			{students.map((student, i) => (
				<StudentItem key={i} {...student} />
			))}
		</ScrollArea>
	);
};

export default StudentsPage;
