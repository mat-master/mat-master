import { Avatar, Badge, Paper, Title } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import React from 'react';
import { UserPlus } from 'react-feather';
import ItemMenu from '../components/item-menu';
import PageHeader from '../components/page-header';
import StudentInviteModal from '../components/student-invite-modal';
import Table from '../components/table';
import useSearchTerm from '../hooks/use-search-tem';

interface StudentSummary {
	name: string;
	status: string;
	memberships: string[];
	avatarUrl?: string;
}

const StudentsPage: React.FC = () => {
	const [searchTerm, setSearchTerm] = useSearchTerm();
	const [modals, setModals] = useSetState({ invite: false });

	const students = Array<StudentSummary>(24).fill({
		name: 'John Doe',
		status: 'active',
		memberships: ['Basic'],
	});

	return (
		<>
			<PageHeader
				title='Students'
				search={setSearchTerm}
				actions={[{ icon: <UserPlus size={18} />, action: () => setModals({ invite: true }) }]}
			/>

			<Paper shadow='md' withBorder>
				<Table<StudentSummary & { menu: never }>
					columns={[
						{ key: 'avatarUrl', name: '', width: 0.8 },
						{ key: 'name', name: 'Name', width: 4 },
						{ key: 'status', name: 'Status', width: 2 },
						{ key: 'memberships', name: 'Memberships', width: 5 },
						{ key: 'menu', name: '', width: 0.8 },
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
							menu: <ItemMenu />,
						}))}
					itemPadding={4}
				/>
			</Paper>

			<StudentInviteModal open={modals.invite} onClose={() => setModals({ invite: false })} />
		</>
	);
};

export default StudentsPage;
