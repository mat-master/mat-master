import { Text } from '@mantine/core'
import type React from 'react'
import { useContext, useMemo } from 'react'
import { CalendarPlus as NewClassIcon } from 'tabler-icons-react'
import { trpcClient } from '../..'
import AppHeader from '../../components/app-header'
import { RemoteClassForm } from '../../components/class-form'
import DynamicallySizedList from '../../components/dynamically-sized-list'
import { modalsCtx } from '../../components/modals-context'
import PageHeader from '../../components/page-header'
import ScheduleDisplay from '../../components/schedule-display'
import SideBar from '../../components/side-bar'
import Table from '../../components/table'
import useSearchTerm from '../../hooks/use-search-term'
import Page from '../../page'
import getSchoolId from '../../utils/get-school-id'
import { trpc } from '../../utils/trpc'

const ClassesPage: React.FC = () => {
	const schoolId = getSchoolId()!
	const modals = useContext(modalsCtx)
	const [searchTerm, debouncedSearchTerm, setSearchTerm] = useSearchTerm()

	const {
		data: classes,
		isLoading,
		error,
	} = trpc.useQuery(['school.classes.all.get', { schoolId }])

	const filteredClasses = useMemo(() => {
		return classes?.filter(({ name }) =>
			name.toLowerCase().includes(searchTerm.toLowerCase())
		)
	}, [debouncedSearchTerm, classes])

	return (
		<Page authorized header={<AppHeader />} sideBar={<SideBar />}>
			<PageHeader
				title='Classes'
				search={setSearchTerm}
				searchTerm={searchTerm}
				actions={[
					{
						icon: NewClassIcon,
						action: () =>
							modals.enqueue({
								title: 'New Class',
								children: (
									<RemoteClassForm onSubmit={() => console.log('close modal')} />
								),
							}),
					},
				]}
			/>

			<Table
				loading={isLoading}
				errorMessage={error?.message}
				columns={[
					{ key: 'name', width: 2 },
					{ key: 'memberships', width: 3 },
					{ key: 'schedule', width: 3 },
				]}
				data={filteredClasses?.map(({ id, name, memberships }) => ({
					name: <Text weight={700}>{name}</Text>,
					memberships: (
						<DynamicallySizedList<bigint, { name: string }>
							itemIds={memberships}
							estimatedItemWidth={72}
							itemElement={({ name }) => <Text>{name}</Text>}
							fetchItemData={(id) =>
								trpcClient.query('school.memberships.get', {
									id,
									schoolId,
								})
							}
						/>
					),
					schedule: <ScheduleDisplay schedule={[]} />,
				}))}
			/>
		</Page>
	)
}

export default ClassesPage
