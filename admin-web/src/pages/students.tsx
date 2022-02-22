import { ActionIcon, Group, Modal, Paper, ScrollArea, TextInput, Title } from '@mantine/core';
import React, { useState } from 'react';
import { UserPlus, X as CloseIcon } from 'react-feather';
import PageHeader from '../components/page-header';
import { StudentsTableHead, StudentTableItem } from '../components/students-table';
import useSearchTerm from '../hooks/use-search-tem';

const StudentsPage: React.FC = () => {
	const [currentStudentId, setCurrentStudentId] = useState<string>();
	const [searchTerm, setSearchTerm] = useSearchTerm();
	const students = Array(24).fill({
		id: '347hf9',
		name: 'John Doe',
		status: 'active',
		membershipCount: 1,
	});

	const currentStudent = students.find(({ id }) => id === currentStudentId);

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
							<StudentTableItem
								key={i}
								{...student}
								openEdit={() => setCurrentStudentId(student.id)}
							/>
						</div>
					))}
				</ScrollArea>
			</Paper>

			<Modal
				opened={typeof currentStudentId === 'string'}
				onClose={() => setCurrentStudentId(undefined)}
				hideCloseButton
			>
				<Group position='apart' align='center'>
					<Title order={2}>{currentStudent?.name}</Title>
					<ActionIcon size='lg' onClick={() => setCurrentStudentId(undefined)}>
						<CloseIcon />
					</ActionIcon>
				</Group>

				<TextInput />
			</Modal>
		</>
	);
};

export default StudentsPage;
