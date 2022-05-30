import { Avatar, Badge, Text, Title } from '@mantine/core'
import { useModals } from '@mantine/modals'
import type React from 'react'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { UserPlus as AddUserIcon } from 'tabler-icons-react'
import AppHeader from '../../components/app-header'
import { RemoteInviteForm } from '../../components/invite-form'
import ItemMenu from '../../components/item-menu'
import PageHeader from '../../components/page-header'
import SideBar from '../../components/side-bar'
import { RemoteStudentForm } from '../../components/student-form'
import Table from '../../components/table'
import TableState from '../../components/table-state'
import { getStudents } from '../../data/students'
import useSearchTerm from '../../hooks/use-search-term'
import Page from '../../page'
import openFormModal from '../../utils/open-form-modal'

const StudentsPage: React.FC = () => {
	const modals = useModals()
	const [searchTerm, debouncedSearchTerm, setSearchTerm] = useSearchTerm()

	const {
		data: students,
		isLoading,
		isError,
		refetch,
	} = useQuery('students', getStudents)
	const filteredStudents = useMemo(() => {
		if (!students) return []
		return students.filter(({ user: { firstName, lastName } }) =>
			`${firstName} ${lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
		)
	}, [debouncedSearchTerm, students])

	return (
		<Page authorized header={<AppHeader />} sideBar={<SideBar />}>
			<PageHeader
				title='Students'
				search={setSearchTerm}
				searchTerm={searchTerm}
				actions={[
					{
						icon: AddUserIcon,
						action: () =>
							openFormModal(modals, 'Invite a Student', <RemoteInviteForm />),
					},
				]}
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
							<Text weight={700}>
								{`${student.user.firstName} ${student.user.lastName}`}
							</Text>
						),
						status: (
							<Badge variant='outline' color={'dark'}>
								TODO
							</Badge>
						),
						memberships: 'TODO',
						menu: (
							<ItemMenu
								onEdit={() =>
									openFormModal(
										modals,
										`${student.user.firstName} ${student.user.lastName}`,
										<RemoteStudentForm id={student.id.toString()} />
									)
								}
								onDelete={() =>
									modals.openConfirmModal({
										title: (
											<Title order={3}>
												Delete {student.user.firstName} {student.user.lastName}?
											</Title>
										),
										children: `This will permanantly delete this student and all associated information, including memberships.`,
									})
								}
							/>
						),
					},
				}))}
				itemPadding={4}
			>
				<TableState
					state={
						isLoading
							? 'loading'
							: isError
							? 'error'
							: !students?.length
							? 'empty'
							: !filteredStudents.length
							? 'filtered'
							: undefined
					}
					resourceLabel='students'
					refetchItems={refetch}
					createItem={() =>
						openFormModal(modals, 'Invite a Student', <RemoteInviteForm />)
					}
					createMessage='Invite a student'
					createIcon={AddUserIcon}
				/>
			</Table>
		</Page>
	)
}

export default StudentsPage
