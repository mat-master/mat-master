import { Divider, Paper, ScrollArea } from '@mantine/core';
import React from 'react';
import { UserPlus } from 'react-feather';
import PageHeader from '../components/page-header';
import StudentItem from '../components/student-item';
import useSearchTerm from '../hooks/use-search-tem';

const StudentsPage: React.FC = () => {
	const [searchTerm, setSearchTerm] = useSearchTerm();
	const students = Array(24).fill({ name: 'John Doe', status: 'active', membershipCount: 1 });

	return (
		<>
			<PageHeader
				title='Students'
				search={setSearchTerm}
				actions={[{ icon: <UserPlus size={18} />, action: () => {} }]}
			/>

			<Paper style={{ overflow: 'hidden' }} shadow='md' withBorder>
				<ScrollArea
					style={{ height: '100%' }}
					styles={{ root: { height: '100%' }, viewport: { padding: 12 } }}
				>
					{students.map((student, i) => (
						<div key={i}>
							<StudentItem key={i} {...student} openEdit={() => console.log('edit')} />
							<Divider />
						</div>
					))}
				</ScrollArea>
			</Paper>
		</>
	);
};

export default StudentsPage;
