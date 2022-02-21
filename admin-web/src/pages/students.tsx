import { Divider, Paper, ScrollArea } from '@mantine/core';
import React from 'react';
import { UserPlus } from 'react-feather';
import PageHeader from '../components/page-header';
import { StudentsTableHead, StudentTableItem } from '../components/students-table';
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

			<Paper
				style={{
					display: 'grid',
					gridTemplateColumns: '1fr',
					gridTemplateRows: 'min-content minmax(0, 1fr)',
					overflow: 'hidden',
				}}
				shadow='md'
				withBorder
			>
				<StudentsTableHead />

				<ScrollArea style={{ height: '100%' }}>
					{students.map((student, i) => (
						<div key={i}>
							<StudentTableItem key={i} {...student} openEdit={() => console.log('edit')} />
							<Divider />
						</div>
					))}
				</ScrollArea>
			</Paper>
		</>
	);
};

export default StudentsPage;
