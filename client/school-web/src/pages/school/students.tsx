import { Avatar, Badge, Text } from '@mantine/core'
import type React from 'react'
import { useContext, useMemo } from 'react'
import { UserPlus as AddUserIcon } from 'tabler-icons-react'
import { trpcClient } from '../..'
import AppHeader from '../../components/app-header'
import DynamicallySizedList from '../../components/dynamically-sized-list'
import { RemoteInviteForm } from '../../components/invite-form'
import { modalsCtx } from '../../components/modals-context'
import PageHeader from '../../components/page-header'
import SideBar from '../../components/side-bar'
import Table from '../../components/table'
import useSearchTerm from '../../hooks/use-search-term'
import Page from '../../page'
import getSchoolId from '../../utils/get-school-id'
import { trpc } from '../../utils/trpc'

const StudentsPage: React.FC = () => {
	const schoolId = getSchoolId()!
	const modals = useContext(modalsCtx)
	const [searchTerm, debouncedSearchTerm, setSearchTerm] = useSearchTerm()

	const {
		data: students,
		isLoading,
		error,
	} = trpc.useQuery(['school.students.all.get', { schoolId }])
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
							modals.enqueue({
								title: 'Invite a Student',
								children: <RemoteInviteForm />,
							}),
					},
				]}
			/>

			<Table
				loading={isLoading}
				errorMessage={error?.message}
				columns={[
					{ key: 'avatar', label: '', width: 0.8 },
					{ key: 'name', width: 4 },
					{ key: 'status', width: 2 },
					{ key: 'memberships', width: 5 },
				]}
				data={filteredStudents.map(({ id, user, memberships }) => ({
					avatar: <Avatar radius='xl' />,
					name: <Text weight={700}>{`${user.firstName} ${user.lastName}`}</Text>,
					status: (
						<Badge variant='outline' color='green'>
							TODO
						</Badge>
					),
					memberships: (
						<DynamicallySizedList<bigint, { name: string }>
							itemIds={memberships}
							estimatedItemWidth={72}
							itemComponent={({ name }) => <Text>{name}</Text>}
							fetchItemData={(id) =>
								trpcClient.query('school.memberships.get', {
									id,
									schoolId,
								})
							}
						/>
					),
				}))}
			/>
		</Page>
	)
}

export default StudentsPage
