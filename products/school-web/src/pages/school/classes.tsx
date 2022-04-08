import { Text } from '@mantine/core'
import { useSetState } from '@mantine/hooks'
import type React from 'react'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { CalendarPlus as NewClassIcon } from 'tabler-icons-react'
import AppHeader from '../../components/app-header'
import ClassModal from '../../components/class-modal'
import ConfirmationModal from '../../components/confirmation-modal'
import ItemMenu from '../../components/item-menu'
import PageHeader from '../../components/page-header'
import SideBar from '../../components/side-bar'
import Table from '../../components/table'
import TableState from '../../components/table-state'
import { getClasses } from '../../data/classes'
import useSearchTerm from '../../hooks/use-search-term'
import Page from '../../page'
import getReadableSchedule from '../../utils/get-readable-shedule'

interface ClassesPageModals {
	edit?: { open: boolean; classId?: string }
	deleteConfirmation?: string | undefined
}

const ClassesPage: React.FC = () => {
	const [modals, setModals] = useSetState<ClassesPageModals>({})
	const [searchTerm, debouncedSearchTerm, setSearchTerm] = useSearchTerm()

	const { data: classes, isLoading, isError, refetch } = useQuery('classes', getClasses)
	const filteredClasses = useMemo(() => {
		if (!classes) return []
		return classes.filter(({ name }) => name.toLowerCase().includes(searchTerm.toLowerCase()))
	}, [debouncedSearchTerm, classes])

	const deleteName =
		classes?.find(({ id }) => id === modals.deleteConfirmation)?.name ?? 'class'

	return (
		<Page authorized header={<AppHeader />} sideBar={<SideBar />}>
			<PageHeader
				title='Classes'
				search={setSearchTerm}
				searchTerm={searchTerm}
				actions={[
					{
						icon: NewClassIcon,
						action: () => setModals({ edit: { open: true, classId: undefined } }),
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
								onEdit={() => setModals({ edit: { open: true, classId: id.toString() } })}
								onDelete={() => setModals({ deleteConfirmation: id.toString() })}
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
					createItem={() => setModals({ edit: { open: true } })}
					createMessage='Create A Class'
					createIcon={NewClassIcon}
				/>
			</Table>

			<ClassModal
				opened={!!modals.edit?.open}
				classId={modals.edit?.classId}
				onClose={() => setModals({ edit: undefined })}
			/>
			<ConfirmationModal
				open={!!modals.deleteConfirmation}
				actionType='delete'
				resourceLabel={deleteName}
				action={() => {}}
				onClose={() => setModals({ deleteConfirmation: undefined })}
			/>
		</Page>
	)
}

export default ClassesPage
