import { Avatar, AvatarsGroup, Title } from '@mantine/core'
import { useSetState } from '@mantine/hooks'
import type React from 'react'
import { useContext, useMemo } from 'react'
import { Plus as PlusIcon } from 'react-feather'
import DataCard from '../components/data-card'
import ItemMenu from '../components/item-menu'
import MembershipEditModal from '../components/membership-edit-modal'
import PageHeader from '../components/page-header'
import Table from '../components/table'
import membershipsContext from '../data/memberships-context'
import useResourceSummaries from '../hooks/use-resource-summaries'
import useSearchTerm from '../hooks/use-search-term'

interface MembershipModals {
	edit?: { open: boolean; id?: string }
}

const MembershipsPage: React.FC = () => {
	const memberships = useContext(membershipsContext)
	const [searchTerm, setSearchTerm] = useSearchTerm()
	const { summaries, loading } = useResourceSummaries(memberships)
	const [modals, setModals] = useSetState<MembershipModals>({})

	const filteredMemberships = useMemo(() => {
		console.log('re-filtering')
		if (!summaries) return []
		return summaries.filter(({ name }) => name.toLowerCase().includes(searchTerm.toLowerCase()))
	}, [searchTerm])

	return (
		<>
			<PageHeader
				title='Memberships'
				search={setSearchTerm}
				searchTerm={searchTerm}
				actions={[
					{ icon: <PlusIcon size={18} />, action: () => setModals({ edit: { open: true } }) },
				]}
			/>

			<DataCard loading={loading}>
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
							menu: <ItemMenu onEdit={() => setModals({ edit: { open: true, id } })} />,
						},
					}))}
					itemPadding={4}
				/>
			</DataCard>

			<MembershipEditModal
				open={!!modals.edit && modals.edit.open}
				membershipId={modals.edit?.id}
				onClose={() => setModals({ edit: { open: false } })}
			/>
		</>
	)
}

export default MembershipsPage
