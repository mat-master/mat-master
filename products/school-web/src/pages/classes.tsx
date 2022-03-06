import { Avatar, AvatarsGroup, Title } from '@mantine/core'
import { useSetState } from '@mantine/hooks'
import type React from 'react'
import { useContext, useMemo } from 'react'
import { Plus as PlusIcon } from 'react-feather'
import ClassEditModal from '../components/class-edit-modal'
import ConfirmationModal from '../components/confirmation-modal'
import DataCard from '../components/data-card'
import ItemMenu from '../components/item-menu'
import PageHeader from '../components/page-header'
import Table from '../components/table'
import classesContext, { type ClassSummary } from '../data/classes-context'
import useResourceSummaries from '../hooks/use-resource-summaries'
import useSearchTerm from '../hooks/use-search-term'

interface ClassesPageModals {
	edit?: { open: boolean; classId?: string }
	deleteConfirmation?: string | undefined
}

const ClassesPage: React.FC = () => {
	const classes = useContext(classesContext)
	const [modals, setModals] = useSetState<ClassesPageModals>({})
	const [searchTerm, setSearchTerm] = useSearchTerm()
	const { summaries, loading } = useResourceSummaries(classes)

	const filteredClasses = useMemo(() => {
		if (!summaries) return []
		return summaries.filter(({ name }) => name.toLowerCase().includes(searchTerm.toLowerCase()))
	}, [searchTerm, summaries])

	return (
		<>
			<PageHeader
				title='Classes'
				search={setSearchTerm}
				searchTerm={searchTerm}
				actions={[
					{
						icon: <PlusIcon size={18} />,
						action: () => setModals({ edit: { open: true, classId: undefined } }),
					},
				]}
			/>

			<DataCard loading={loading}>
				<Table<keyof (ClassSummary & { menu: never })>
					columns={[
						{ key: 'name', name: 'Name', width: 2 },
						{ key: 'studentAvatars', name: 'Students', width: 2 },
						{ key: 'memberships', name: 'Memberships', width: 3 },
						{ key: 'schedule', name: 'Schedule', width: 2 },
						{ key: 'menu', name: '', width: 0.5 },
					]}
					items={filteredClasses.map(({ id, name, studentAvatars, memberships, schedule }) => ({
						data: {
							name: <Title order={6}>{name}</Title>,
							studentAvatars: (
								<AvatarsGroup limit={4} spacing='xl'>
									{studentAvatars.map((src, i) => (
										<Avatar key={i} src={src} />
									))}
								</AvatarsGroup>
							),
							memberships: memberships.join(', '),
							schedule,
							menu: (
								<ItemMenu
									onEdit={() => setModals({ edit: { open: true, classId: id } })}
									onDelete={() => setModals({ deleteConfirmation: id })}
								/>
							),
						},
					}))}
					itemPadding={4}
				/>
			</DataCard>

			<ClassEditModal
				open={!!modals.edit?.open}
				classId={modals.edit?.classId}
				onClose={() => setModals({ edit: undefined })}
			/>

			{modals.deleteConfirmation && (
				<ConfirmationModal
					resourceLabel={
						summaries?.find(({ id }) => id === modals.deleteConfirmation)?.name ?? ''
					}
					action={() => new Promise((resolve) => setTimeout(resolve, 2000))}
					onClose={() => setModals({ deleteConfirmation: undefined })}
				/>
			)}
		</>
	)
}

export default ClassesPage
