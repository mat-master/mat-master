import { Text } from '@mantine/core'
import { useSetState } from '@mantine/hooks'
import type React from 'react'
import { useMemo } from 'react'
import { useQuery } from 'react-query'
import { Plus as NewMembershipIcon } from 'tabler-icons-react'
import AppHeader from '../../components/app-header'
import ConfirmationModal from '../../components/confirmation-modal'
import ItemMenu from '../../components/item-menu'
import MembershipModal from '../../components/membership-modal'
import PageHeader from '../../components/page-header'
import SideBar from '../../components/side-bar'
import Table from '../../components/table'
import TableState from '../../components/table-state'
import { getMemberships } from '../../data/memberships'
import useSearchTerm from '../../hooks/use-search-term'
import Page from '../../page'

interface MembershipModals {
	edit?: { open: boolean; id?: string }
	deleteConfirmation?: string
}

const MembershipsPage: React.FC = () => {
	const [searchTerm, debouncedSearchTerm, setSearchTerm] = useSearchTerm()
	const [modals, setModals] = useSetState<MembershipModals>({})

	const {
		data: memberships,
		isLoading,
		isError,
		refetch,
	} = useQuery('memberships', getMemberships)
	const filteredMemberships = useMemo(() => {
		if (!memberships) return []
		return memberships.filter(({ name }) =>
			name.toLowerCase().includes(searchTerm.toLowerCase())
		)
	}, [debouncedSearchTerm, memberships])

	const deleteName =
		memberships?.find(({ id }) => id === modals.deleteConfirmation)?.name ?? 'membership'

	return (
		<Page authorized header={<AppHeader />} sideBar={<SideBar />}>
			<PageHeader
				title='Memberships'
				search={setSearchTerm}
				searchTerm={searchTerm}
				actions={[
					{ icon: NewMembershipIcon, action: () => setModals({ edit: { open: true } }) },
				]}
			/>

			<Table
				columns={[
					{ key: 'name', name: 'Name', width: 2 },
					{ key: 'classes', name: 'Classes', width: 3 },
					{ key: 'students', name: 'Students', width: 3 },
					{ key: 'price', name: 'Price', width: 1 },
					{ key: 'menu', name: '', width: 0.5 },
				]}
				items={filteredMemberships.map(({ id, name, classes, price }) => ({
					data: {
						name: <Text weight={700}>{name}</Text>,
						classes: classes.map(({ name }) => name).join(', '),
						students: 'TODO',
						price: `$${price} / mo.`,
						menu: (
							<ItemMenu
								onEdit={() => setModals({ edit: { open: true, id: id.toString() } })}
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
							: !memberships?.length
							? 'empty'
							: !filteredMemberships.length
							? 'filtered'
							: undefined
					}
					resourceLabel='memberships'
					refetchItems={refetch}
					createItem={() => setModals({ edit: { open: true } })}
					createMessage='Create A Membership'
				/>
			</Table>

			<MembershipModal
				opened={!!modals.edit?.open}
				membershipId={modals.edit?.id}
				onClose={() => setModals({ edit: { open: false } })}
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

export default MembershipsPage
