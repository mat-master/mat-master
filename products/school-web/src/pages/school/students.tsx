import { Avatar, Badge, Title } from '@mantine/core'
import { useSetState } from '@mantine/hooks'
import type React from 'react'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { UserPlus as AddUserIcon } from 'tabler-icons-react'
import ConfirmationModal from '../../components/confirmation-modal'
import DataCard from '../../components/data-card'
import ItemMenu from '../../components/item-menu'
import PageHeader from '../../components/page-header'
import StudentEditModal from '../../components/student-edit-modal'
import StudentInviteModal from '../../components/student-invite-modal'
import Table from '../../components/table'
import { getStudents } from '../../data/students'
import useSearchTerm from '../../hooks/use-search-term'

interface StudentsPageModals {
	invite: boolean | undefined
	edit: string | undefined
	deleteConfirmation: string | undefined
}

const StudentsPage: React.FC = () => {
	const [modals, setModals] = useSetState<Partial<StudentsPageModals>>({})
	const [searchTerm, debouncedSearchTerm, setSearchTerm] = useSearchTerm()

	const { data: students, isLoading } = useQuery('students', getStudents)
	const filteredStudents = useMemo(() => {
		if (!students) return []
		return students.filter(({ user: { firstName, lastName } }) =>
			`${firstName} ${lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
		)
	}, [debouncedSearchTerm, students])

	const deleteUser = students?.find(
		({ id }) => id.toString() === modals.deleteConfirmation
	)?.user
	const deleteName = deleteUser && `${deleteUser.lastName} ${deleteUser.lastName}`

	return (
		<>
			<PageHeader
				title='Students'
				search={setSearchTerm}
				searchTerm={searchTerm}
				actions={[{ icon: AddUserIcon, action: () => setModals({ invite: true }) }]}
			/>

			<DataCard>
				<Table
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
							name: (
								<Title order={6}>{`${student.user.firstName} ${student.user.lastName}`}</Title>
							),
							status: (
								<Badge variant='outline' color={'dark'}>
									TODO
								</Badge>
							),
							memberships: 'TODO',
							menu: (
								<ItemMenu
									onEdit={() => setModals({ edit: student.id.toString() })}
									onDelete={() => setModals({ deleteConfirmation: student.id.toString() })}
								/>
							),
						},
					}))}
					itemPadding={4}
					loading={isLoading}
				/>
			</DataCard>

			<StudentInviteModal
				opened={!!modals.invite}
				onClose={() => setModals({ invite: false })}
			/>
			<StudentEditModal
				opened={!!modals.edit}
				studentId={modals.edit}
				onClose={() => setModals({ edit: undefined })}
			/>
			<ConfirmationModal
				open={!!modals.deleteConfirmation}
				actionType='Delete'
				resourceLabel={deleteName ?? 'student'}
				onClose={() => setModals({ deleteConfirmation: undefined })}
				action={() => {}}
			/>
		</>
	)
}

export default StudentsPage
