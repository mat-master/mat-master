import { Button, Group, Loader, Text } from '@mantine/core'
import { useSetState } from '@mantine/hooks'
import { useNotifications } from '@mantine/notifications'
import type React from 'react'
import { useContext, useMemo } from 'react'
import { useQuery } from 'react-query'
import { CalendarPlus as NewClassIcon, Refresh as RefreshIcon } from 'tabler-icons-react'
import ClassEditModal from '../../components/class-edit-modal'
import ConfirmationModal from '../../components/confirmation-modal'
import ItemMenu from '../../components/item-menu'
import PageHeader from '../../components/page-header'
import Table from '../../components/table'
import { getClasses } from '../../data/classes'
import classesContext, { type ClassSummary } from '../../data/classes-context'
import useSearchTerm from '../../hooks/use-search-term'
import getReadableSchedule from '../../utils/get-readable-shedule'
import setRemoteResource from '../../utils/set-remote-resource'

interface ClassesPageModals {
	edit?: { open: boolean; classId?: string }
	deleteConfirmation?: string | undefined
}

const ClassesPage: React.FC = () => {
	const classesSrc = useContext(classesContext)
	const [modals, setModals] = useSetState<ClassesPageModals>({})
	const [searchTerm, debouncedSearchTerm, setSearchTerm] = useSearchTerm()
	const notifications = useNotifications()

	const { data: classes, isLoading, isError, refetch } = useQuery('classes', getClasses)
	const filteredClasses = useMemo(() => {
		if (!classes) return []
		return classes.filter(({ name }) => name.toLowerCase().includes(searchTerm.toLowerCase()))
	}, [debouncedSearchTerm, classes])

	const deleteName =
		classes?.find(({ id }) => id === modals.deleteConfirmation)?.name ?? 'class'

	return (
		<>
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

			<Table<keyof (ClassSummary & { menu: never })>
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
				state={isLoading ? 'loading' : isError ? 'error' : undefined}
				loadingMessage={<Loader />}
				errorMessage={
					<Group direction='column' align='center'>
						<Text color='red'>Something went wrong while loading your classes</Text>
						<Button leftIcon={<RefreshIcon size={16} />} onClick={() => refetch()}>
							Retry
						</Button>
					</Group>
				}
				emptyMessage={
					classes?.length ? (
						<Text color='dimmed'>No classes matched your search</Text>
					) : (
						<Group direction='column' align='center'>
							<Text color='dimmed' weight={700}>
								You don't have any classes yet
							</Text>
							<Button
								leftIcon={<NewClassIcon size={16} />}
								onClick={() => setModals({ edit: { open: true } })}
							>
								Create A Class
							</Button>
						</Group>
					)
				}
			/>

			<ClassEditModal
				opened={!!modals.edit?.open}
				classId={modals.edit?.classId}
				onClose={() => setModals({ edit: undefined })}
			/>
			<ConfirmationModal
				open={!!modals.deleteConfirmation}
				actionType='delete'
				resourceLabel={deleteName}
				action={() =>
					setRemoteResource(classesSrc, {
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

export default ClassesPage
