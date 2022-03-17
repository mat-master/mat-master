import { Button, Group, Loader, Text } from '@mantine/core'
import { useSetState } from '@mantine/hooks'
import { useNotifications } from '@mantine/notifications'
import type React from 'react'
import { useContext, useMemo } from 'react'
import { useQuery } from 'react-query'
import { Plus as NewMembershipIcon, Refresh as RefreshIcon } from 'tabler-icons-react'
import ConfirmationModal from '../../components/confirmation-modal'
import ItemMenu from '../../components/item-menu'
import MembershipEditModal from '../../components/membership-edit-modal'
import PageHeader from '../../components/page-header'
import Table from '../../components/table'
import { getMemberships } from '../../data/memberships'
import membershipsContext from '../../data/memberships-context'
import useSearchTerm from '../../hooks/use-search-term'
import setRemoteResource from '../../utils/set-remote-resource'

interface MembershipModals {
	edit?: { open: boolean; id?: string }
	deleteConfirmation?: string
}

const MembershipsPage: React.FC = () => {
	const membershipsSrc = useContext(membershipsContext)
	const [searchTerm, debouncedSearchTerm, setSearchTerm] = useSearchTerm()
	const [modals, setModals] = useSetState<MembershipModals>({})
	const notifications = useNotifications()

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
		membershipsSrc.summaries?.find(({ id }) => id === modals.deleteConfirmation)?.name ??
		'membership'

	return (
		<>
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
						classes: classes.join(', '),
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
				state={isLoading ? 'loading' : isError ? 'error' : undefined}
				loadingMessage={<Loader />}
				errorMessage={
					<Group direction='column' align='center'>
						<Text color='red'>Something went wrong while loading your memberships</Text>
						<Button leftIcon={<RefreshIcon size={16} />} onClick={() => refetch()}>
							Retry
						</Button>
					</Group>
				}
				emptyMessage={
					memberships?.length ? (
						<Text color='dimmed'>No memberships matched your search</Text>
					) : (
						<Group direction='column' align='center'>
							<Text color='dimmed' weight={700}>
								You don't have any memberships yet
							</Text>
							<Button
								leftIcon={<NewMembershipIcon size={16} />}
								onClick={() => setModals({ edit: { open: true } })}
							>
								Create A Membership
							</Button>
						</Group>
					)
				}
			/>

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
