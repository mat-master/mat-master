import { Avatar, AvatarsGroup, Text } from '@mantine/core'
import type React from 'react'
import { useContext, useMemo } from 'react'
import { Plus as NewMembershipIcon } from 'tabler-icons-react'
import AppHeader from '../../components/app-header'
import { RemoteMembershipForm } from '../../components/membership-form'
import { modalsCtx } from '../../components/modals-context'
import PageHeader from '../../components/page-header'
import SideBar from '../../components/side-bar'
import Table from '../../components/table'
import useSearchTerm from '../../hooks/use-search-term'
import Page from '../../page'
import getSchoolId from '../../utils/get-school-id'
import { trpc } from '../../utils/trpc'

const MembershipsPage: React.FC = () => {
	const schoolId = getSchoolId()
	const modals = useContext(modalsCtx)
	const [searchTerm, debouncedSearchTerm, setSearchTerm] = useSearchTerm()

	const {
		data: memberships,
		isLoading,
		error,
	} = trpc.useQuery(['school.memberships.all.get', { schoolId }])
	const filteredMemberships = useMemo(() => {
		return memberships?.filter(({ name }) =>
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
							modals.enqueue({
								title: 'New Membership',
								children: <RemoteMembershipForm />,
							}),
					},
				]}
			/>

			<Table
				loading={isLoading}
				errorMessage={error?.message}
				columns={[
					{ key: 'name', width: 2 },
					{ key: 'classes', width: 3 },
					{ key: 'students', width: 3 },
					{ key: 'price', width: 1 },
				]}
				data={filteredMemberships?.map(
					({ id, name, classes, price, interval, intervalCount, students }) => ({
						name: <Text weight={700}>{name}</Text>,
						classes: classes.join(', '),
						students: (
							<AvatarsGroup limit={5}>
								{students.map((id) => (
									<Avatar />
								))}
							</AvatarsGroup>
						),
						price: `$${price} every ${
							intervalCount === 1 ? interval : `${intervalCount} ${interval}s`
						}`,
					})
				)}
			/>
		</Page>
	)
}

export default MembershipsPage
