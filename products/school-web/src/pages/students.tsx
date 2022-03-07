import { Avatar, Badge, Title } from '@mantine/core'
import { useSetState } from '@mantine/hooks'
import { useNotifications } from '@mantine/notifications'
import type React from 'react'
import { useContext, useMemo } from 'react'
import { UserPlus } from 'react-feather'
import ConfirmationModal from '../components/confirmation-modal'
import DataCard from '../components/data-card'
import ItemMenu from '../components/item-menu'
import PageHeader from '../components/page-header'
import StudentEditModal from '../components/student-edit-modal'
import StudentInviteModal from '../components/student-invite-modal'
import Table from '../components/table'
import studentsContext from '../data/students-context'
import useResourceSummaries from '../hooks/use-resource-summaries'
import useSearchTerm from '../hooks/use-search-term'
import setRemoteResource from '../utils/set-remote-resource'

interface StudentsPageModals {
	invite?: boolean | undefined
	edit?: string | undefined
	deleteConfirmation?: string | undefined
}

const StudentsPage: React.FC = () => {
	const studentsSrc = useContext(studentsContext)
	const [modals, setModals] = useSetState<StudentsPageModals>({})
	const [searchTerm, setSearchTerm] = useSearchTerm()
	const { summaries, loading } = useResourceSummaries(studentsSrc)
	const notifications = useNotifications()

	const filteredStudents = useMemo(() => {
		if (!summaries) return []
		return summaries.filter(({ name }) => name.toLowerCase().includes(searchTerm.toLowerCase()))
	}, [searchTerm, summaries])

	const deleteName =
		summaries?.find(({ id }) => id === modals.deleteConfirmation)?.name ?? 'student'

	return (
		<>
			<PageHeader
				title='Students'
				search={setSearchTerm}
				searchTerm={searchTerm}
				actions={[{ icon: <UserPlus size={18} />, action: () => setModals({ invite: true }) }]}
			/>

			<DataCard loading={loading}>
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
							name: <Title order={6}>{student.name}</Title>,
							status: (
								<Badge variant='outline' color='green'>
									{student.activityStatus}
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
			</DataCard>

			<StudentInviteModal open={!!modals.invite} onClose={() => setModals({ invite: false })} />
			<StudentEditModal
				open={!!modals.edit}
				studentId={modals.edit}
				onClose={() => setModals({ edit: undefined })}
			/>
			<ConfirmationModal
				open={!!modals.deleteConfirmation}
				actionType='Delete'
				resourceLabel={deleteName}
				action={() =>
					setRemoteResource(studentsSrc, {
						id: modals.deleteConfirmation,
						resourceLabel: deleteName,
						notifications,
					})
				}
				onClose={() => setModals({ deleteConfirmation: undefined })}
			/>
		</>
	)
}

export default StudentsPage
