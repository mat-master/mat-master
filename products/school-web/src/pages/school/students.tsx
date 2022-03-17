import { Avatar, Badge, Button, Group, Loader, Text } from '@mantine/core'
import { useSetState } from '@mantine/hooks'
import type React from 'react'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { Refresh as RefreshIcon, UserPlus as AddUserIcon } from 'tabler-icons-react'
import ConfirmationModal from '../../components/confirmation-modal'
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

	const { data: students, isLoading, isError, refetch } = useQuery('students', getStudents)
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
							<Text weight={700}>{`${student.user.firstName} ${student.user.lastName}`}</Text>
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
				state={isLoading ? 'loading' : isError ? 'error' : undefined}
				loadingMessage={<Loader />}
				errorMessage={
					<Group direction='column' align='center'>
						<Text color='red'>Something went wrong while loading your students</Text>
						<Button leftIcon={<RefreshIcon size={16} />} onClick={() => refetch()}>
							Retry
						</Button>
					</Group>
				}
				emptyMessage={
					students?.length ? (
						<Text color='dimmed'>No students matched your search</Text>
					) : (
						<Group direction='column' align='center'>
							<Text color='dimmed' weight={700}>
								You don't have any students yet
							</Text>
							<Button
								leftIcon={<AddUserIcon size={16} />}
								onClick={() => setModals({ invite: true })}
							>
								Invite A Student
							</Button>
						</Group>
					)
				}
			/>

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
