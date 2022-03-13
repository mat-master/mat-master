import { Avatar, AvatarsGroup, Title } from '@mantine/core'
import { useSetState } from '@mantine/hooks'
import { useNotifications } from '@mantine/notifications'
import type React from 'react'
import { useContext, useMemo } from 'react'
import { Plus as PlusIcon } from 'tabler-icons-react'
import ConfirmationModal from '../../components/confirmation-modal'
import DataCard from '../../components/data-card'
import ItemMenu from '../../components/item-menu'
import MembershipEditModal from '../../components/membership-edit-modal'
import PageHeader from '../../components/page-header'
import Table from '../../components/table'
import membershipsContext from '../../data/memberships-context'
import useResourceSummaries from '../../hooks/use-resource-summaries'
import useSearchTerm from '../../hooks/use-search-term'
import setRemoteResource from '../../utils/set-remote-resource'

interface MembershipModals {
	edit?: { open: boolean; id?: string }
	deleteConfirmation?: string
}

const MembershipsPage: React.FC = () => {
	const membershipsSrc = useContext(membershipsContext)
	const [searchTerm, debouncedSearchTerm, setSearchTerm] = useSearchTerm()
	const { summaries, loading } = useResourceSummaries(membershipsSrc)
	const [modals, setModals] = useSetState<MembershipModals>({})
	const notifications = useNotifications()

	const filteredMemberships = useMemo(() => {
		if (!summaries) return []
		return summaries.filter(({ name }) => name.toLowerCase().includes(searchTerm.toLowerCase()))
	}, [debouncedSearchTerm, summaries])

	const deleteName =
		membershipsSrc.summaries?.find(({ id }) => id === modals.deleteConfirmation)?.name ??
		'membership'

	return (
		<>
			<PageHeader
				title='Memberships'
				search={setSearchTerm}
				searchTerm={searchTerm}
				actions={[{ icon: PlusIcon, action: () => setModals({ edit: { open: true } }) }]}
			/>

			<DataCard>
				<Table
					columns={[
						{ key: 'name', name: 'Name', width: 2 },
						{ key: 'classes', name: 'Classes', width: 3 },
						{ key: 'students', name: 'Students', width: 3 },
						{ key: 'price', name: 'Price', width: 1 },
						{ key: 'menu', name: '', width: 0.5 },
					]}
					items={filteredMemberships.map(({ id, name, classes, studentAvatars, price }) => ({
						data: {
							name: <Title order={6}>{name}</Title>,
							classes: classes.join(', '),
							students: (
								<AvatarsGroup limit={4}>
									{studentAvatars.map((src, i) => (
										<Avatar key={i} src={src} />
									))}
								</AvatarsGroup>
							),
							price: `$${price} / mo.`,
							menu: (
								<ItemMenu
									onEdit={() => setModals({ edit: { open: true, id } })}
									onDelete={() => setModals({ deleteConfirmation: id })}
								/>
							),
						},
					}))}
					itemPadding={4}
					loading={loading}
				/>
			</DataCard>

			<MembershipEditModal
				opened={!!modals.edit?.open}
				membershipId={modals.edit?.id}
				onClose={() => setModals({ edit: { open: false } })}
			/>
			<ConfirmationModal
				open={!!modals.deleteConfirmation}
				actionType='delete'
				resourceLabel={deleteName}
				action={() =>
					setRemoteResource(membershipsSrc, {
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

export default MembershipsPage
