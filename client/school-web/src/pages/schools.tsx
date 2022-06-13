import { SimpleGrid, Skeleton, Title } from '@mantine/core'
import { useModals } from '@mantine/modals'
import type React from 'react'
import { Apps as NewSchoolIcon } from 'tabler-icons-react'
import AppHeader from '../components/app-header'
import PageHeader from '../components/page-header'
import SchoolCard from '../components/school-card'
import { RemoteSchoolForm } from '../components/school-form'
import Page from '../page'
import { trpc } from '../utils/trpc'

const SchoolsPage: React.FC = () => {
	const modals = useModals()
	const { data: schools, isLoading } = trpc.useQuery(['user.schools.get'])

	return (
		<Page authorized header={<AppHeader />}>
			<PageHeader
				title='Schools'
				search={() => {}}
				actions={[
					{
						icon: NewSchoolIcon,
						action: () =>
							modals.openModal({
								title: <Title order={3}>New School</Title>,
								children: <RemoteSchoolForm />,
							}),
					},
				]}
			/>
			<SimpleGrid cols={4} spacing='xl'>
				{isLoading &&
					Array(4)
						.fill(undefined)
						.map((_, i) => (
							<Skeleton
								key={i}
								sx={(theme) => ({
									boxShadow: theme.shadows.sm,
									border: `1px solid ${theme.colors.gray[3]}`,
								})}
							>
								<SchoolCard key={i} name='' href='' image='' />
							</Skeleton>
						))}

				{schools?.owner.map((school) => (
					<Skeleton key={school.id.toString()} visible={isLoading}>
						<SchoolCard
							name={school.name}
							href={`./${school.id}`}
							image='https://images.unsplash.com/photo-1647708941340-fd3a55d5fc87?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80'
						/>
					</Skeleton>
				))}
			</SimpleGrid>
		</Page>
	)
}

export default SchoolsPage
