import { Text } from '@mantine/core'
import { useModals } from '@mantine/modals'
import type React from 'react'
import { useContext, useMemo } from 'react'
import { CalendarPlus as NewClassIcon } from 'tabler-icons-react'
import { trpc } from '../..'
import AppHeader from '../../components/app-header'
import { RemoteClassForm } from '../../components/class-form'
import ItemMenu from '../../components/item-menu'
import PageHeader from '../../components/page-header'
import ScheduleDisplay from '../../components/schedule-display'
import SideBar from '../../components/side-bar'
import Table from '../../components/table'
import TableState from '../../components/table-state'
import { schoolContext } from '../../data/school-provider'
import useSearchTerm from '../../hooks/use-search-term'
import Page from '../../page'
import openFormModal from '../../utils/open-form-modal'

const ClassesPage: React.FC = () => {
	const [searchTerm, debouncedSearchTerm, setSearchTerm] = useSearchTerm()
	const modals = useModals()

	const { id: schoolId } = useContext(schoolContext)
	const {
		data: classes,
		isLoading,
		isError,
		refetch,
	} = trpc.useQuery(['school.classes.getAll', { schoolId }])
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
						action: () => openFormModal(modals, 'New Class', <RemoteClassForm />),
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
						schedule: <ScheduleDisplay schedule={schedule} />,
						menu: (
							<ItemMenu
								onEdit={() =>
									openFormModal(
										modals,
										name,
										<RemoteClassForm
											id={id.toString()}
											defaultValues={{ name, schedule }}
										/>
									)
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
					createItem={() => openFormModal(modals, 'New Class', <RemoteClassForm />)}
					createMessage='Create A Class'
					createIcon={NewClassIcon}
				/>
			</Table>
		</Page>
	)
}

export default ClassesPage
