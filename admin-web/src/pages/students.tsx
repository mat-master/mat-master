import {
	ActionIcon,
	Avatar,
	Badge,
	Group,
	Menu,
	Modal,
	Paper,
	TextInput,
	Title,
} from '@mantine/core';
import React, { useState } from 'react';
import { UserPlus, X as CloseIcon } from 'react-feather';
import PageHeader from '../components/page-header';
import Table from '../components/table';
import useSearchTerm from '../hooks/use-search-tem';

interface StudentSummary {
	name: string;
	status: string;
	memberships: string[];
	avatarUrl?: string;
}

const StudentsPage: React.FC = () => {
	const [currentStudentName, setCurrentStudentName] = useState<string>();
	const [searchTerm, setSearchTerm] = useSearchTerm();

	const students = Array<StudentSummary>(24).fill({
		name: 'John Doe',
		status: 'active',
		memberships: ['Basic'],
	});

	const currentStudent = students.find(({ name }) => name === currentStudentName);

	return (
		<>
			<PageHeader
				title='Students'
				search={setSearchTerm}
				actions={[{ icon: <UserPlus size={18} />, action: () => {} }]}
			/>

			<Paper shadow='md' withBorder>
				<Table<StudentSummary & { menu: never }>
					columns={[
						{ key: 'avatarUrl', name: '' },
						{ key: 'name', name: 'Name', width: 4 },
						{ key: 'status', name: 'Status', width: 2 },
						{ key: 'memberships', name: 'Memberships', width: 5 },
						{ key: 'menu', name: '' },
					]}
					items={students
						.filter((student) => student.name.toLowerCase().includes(searchTerm.toLowerCase()))
						.map((student) => ({
							avatarUrl: <Avatar radius='xl' />,
							name: <Title order={6}>{student.name}</Title>,
							status: (
								<Badge variant='outline' color='green'>
									{student.status}
								</Badge>
							),
							memberships: student.memberships.join(', '),
							menu: (
								<Menu>
									<Menu.Item onClick={() => setCurrentStudentName(student.name)}>
										Edit
									</Menu.Item>
								</Menu>
							),
						}))}
				/>
			</Paper>

			<Modal
				opened={!!currentStudentName}
				onClose={() => setCurrentStudentName(undefined)}
				hideCloseButton
			>
				<Group position='apart' align='center'>
					<Title order={2}>{currentStudent?.name}</Title>
					<ActionIcon size='lg' onClick={() => setCurrentStudentName(undefined)}>
						<CloseIcon />
					</ActionIcon>
				</Group>

				<TextInput />
			</Modal>
		</>
	);
};

export default StudentsPage;
