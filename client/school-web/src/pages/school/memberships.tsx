import { Text } from '@mantine/core'
import { useModals } from '@mantine/modals'
import type React from 'react'
import { useContext, useMemo } from 'react'
import { Plus as NewMembershipIcon } from 'tabler-icons-react'
import AppHeader from '../../components/app-header'
import ItemMenu from '../../components/item-menu'
import { RemoteMembershipForm } from '../../components/membership-form'
import PageHeader from '../../components/page-header'
import SideBar from '../../components/side-bar'
import Table from '../../components/table'
import TableState from '../../components/table-state'
import { schoolContext } from '../../data/school-provider'
import useSearchTerm from '../../hooks/use-search-term'
import Page from '../../page'
import openFormModal from '../../utils/open-form-modal'
import { trpc } from '../../utils/trpc'

const MembershipsPage: React.FC = () => {
	const [searchTerm, debouncedSearchTerm, setSearchTerm] = useSearchTerm()
	const modals = useModals()

	const { id: schoolId } = useContext(schoolContext)
	const {
		data: memberships,
		isLoading,
		isError,
		refetch,
	} = trpc.useQuery(['school.memberships.all.get', { schoolId }])
	const filteredMemberships = useMemo(() => {
		if (!memberships) return []
		return memberships.filter(({ name }) =>
			name.toLowerCase().includes(searchTerm.toLowerCase())
		)
	}, [debouncedSearchTerm, memberships])

	return (
		<Page authorized header={<AppHeader />} sideBar={<SideBar />}>
			<PageHeader
				title='Memberships'
				search={setSearchTerm}
				searchTerm={searchTerm}
				actions={[
					{
						icon: NewMembershipIcon,
						action: () =>
							openFormModal(modals, 'New Membership', <RemoteMembershipForm />),
					},
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
						classes: classes.map((id) => id).join(', '),
						students: 'TODO',
						price: `$${price} / mo.`,
						menu: (
							<ItemMenu
								onEdit={() =>
									openFormModal(modals, name, <RemoteMembershipForm id={id} />)
								}
								onDelete={() =>
									modals.openConfirmModal({
										title: `Are you sure you want to delete ${name}`,
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
							: !memberships?.length
							? 'empty'
							: !filteredMemberships.length
							? 'filtered'
							: undefined
					}
					resourceLabel='memberships'
					refetchItems={refetch}
					createItem={() =>
						openFormModal(modals, 'New Membership', <RemoteMembershipForm />)
					}
					createMessage='Create A Membership'
				/>
			</Table>
		</Page>
	)
}

export default MembershipsPage
