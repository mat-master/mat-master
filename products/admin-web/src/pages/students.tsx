import { Avatar, Badge, Paper, Title } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import type React from 'react';
import { useMemo } from 'react';
import { UserPlus } from 'react-feather';
import ConfirmationModal from '../components/confirmation-modal';
import ItemMenu from '../components/item-menu';
import PageHeader from '../components/page-header';
import StudentEditModal from '../components/student-edit-modal';
import StudentInviteModal from '../components/student-invite-modal';
import Table from '../components/table';
import useSearchTerm from '../hooks/use-search-term';

interface StudentSummary {
	id: string;
	name: string;
	status: string;
	memberships: string[];
	avatarUrl?: string;
}

interface StudentsPageModals {
	invite?: boolean | undefined;
	edit?: string | undefined;
	deleteConfirmation?: string | undefined;
}

const students = Array<StudentSummary>(24).fill({
	id: 'k93487hkf',
	name: 'John Doe',
	status: 'active',
	memberships: ['Basic'],
});

const StudentsPage: React.FC = () => {
	const [modals, setModals] = useSetState<StudentsPageModals>({});
	const [searchTerm, setSearchTerm] = useSearchTerm();
	const filteredStudents = useMemo(
		() => students.filter(({ name }) => name.toLowerCase().includes(searchTerm.toLowerCase())),
		[searchTerm]
	);

	return (
		<>
			<PageHeader
				title='Students'
				search={setSearchTerm}
				searchTerm={searchTerm}
				actions={[{ icon: <UserPlus size={18} />, action: () => setModals({ invite: true }) }]}
			/>

			<Paper shadow='md' withBorder>
				<Table<keyof (StudentSummary & { menu: never })>
					columns={[
						{ key: 'avatarUrl', name: '', width: 0.8 },
						{ key: 'name', name: 'Name', width: 4 },
						{ key: 'status', name: 'Status', width: 2 },
						{ key: 'memberships', name: 'Memberships', width: 5 },
						{ key: 'menu', name: '', width: 0.8 },
					]}
					items={filteredStudents.map((student) => ({
						data: {
							avatarUrl: <Avatar radius='xl' />,
							name: <Title order={6}>{student.name}</Title>,
							status: (
								<Badge variant='outline' color='green'>
									{student.status}
								</Badge>
							),
							memberships: student.memberships.join(', '),
							menu: (
								<ItemMenu
									onEdit={() => setModals({ edit: student.id })}
									onDelete={() => setModals({ deleteConfirmation: student.id })}
								/>
							),
						},
					}))}
					itemPadding={4}
				/>
			</Paper>

			<StudentInviteModal open={!!modals.invite} onClose={() => setModals({ invite: false })} />
			<StudentEditModal open={!!modals.edit} onClose={() => setModals({ edit: undefined })} />
			<ConfirmationModal
				resourceType='student'
				open={!!modals.deleteConfirmation}
				action={() => new Promise((resolve) => setTimeout(resolve, 2000))}
				onClose={() => setModals({ deleteConfirmation: undefined })}
				workingMessage='Deleting student...'
				successMessage='Student deleted'
			/>
		</>
	);
};

export default StudentsPage;
