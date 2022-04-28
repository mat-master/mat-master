import { Text, Title } from '@mantine/core'
import { useModals } from '@mantine/modals'
import type React from 'react'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { CalendarPlus as NewClassIcon } from 'tabler-icons-react'
import AppHeader from '../../components/app-header'
import ClassForm from '../../components/class-form'
import ItemMenu from '../../components/item-menu'
import PageHeader from '../../components/page-header'
import SideBar from '../../components/side-bar'
import Table from '../../components/table'
import TableState from '../../components/table-state'
import { getClasses } from '../../data/classes'
import useSearchTerm from '../../hooks/use-search-term'
import Page from '../../page'
import getReadableSchedule from '../../utils/get-readable-shedule'

const ClassesPage: React.FC = () => {
	const [searchTerm, debouncedSearchTerm, setSearchTerm] = useSearchTerm()
	const modals = useModals()

	const {
		data: classes,
		isLoading,
		isError,
		refetch,
	} = useQuery('classes', getClasses)
	const filteredClasses = useMemo(() => {
		if (!classes) return []
		return classes.filter(({ name }) =>
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
							modals.openModal({
								title: <Title order={3}>New Class</Title>,
								children: <ClassForm />,
							}),
					},
				]}
			/>

			<Table
				columns={[
					{ key: 'name', name: 'Name', width: 2 },
					{ key: 'studentAvatars', name: 'Students', width: 2 },
					{ key: 'memberships', name: 'Memberships', width: 3 },
					{ key: 'schedule', name: 'Schedule', width: 3 },
					{ key: 'menu', name: '', width: 0.5 },
				]}
				items={filteredClasses.map(({ id, name, schedule }) => ({
					data: {
						name: <Text weight={700}>{name}</Text>,
						studentAvatars: 'TODO',
						memberships: 'TODO',
						schedule: getReadableSchedule(schedule),
						menu: (
							<ItemMenu
								onEdit={() =>
									modals.openModal({
										title: <Title order={3}>{name}</Title>,
										children: <ClassForm id={id.toString()} />,
									})
								}
								onDelete={() =>
									modals.openConfirmModal({
										title: `Are you sure you want to delete ${name}?`,
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
							: !classes?.length
							? 'empty'
							: !filteredClasses.length
							? 'filtered'
							: undefined
					}
					resourceLabel='classes'
					refetchItems={refetch}
					createItem={() =>
						modals.openModal({
							title: <Title order={3}>New Class</Title>,
							children: <ClassForm />,
						})
					}
					createMessage='Create A Class'
					createIcon={NewClassIcon}
				/>
			</Table>
		</Page>
	)
}

export default ClassesPage
