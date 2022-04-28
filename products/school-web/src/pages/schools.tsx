import { SimpleGrid, Skeleton } from '@mantine/core'
import type React from 'react'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { Apps as NewSchoolIcon } from 'tabler-icons-react'
import AppHeader from '../components/app-header'
import PageHeader from '../components/page-header'
import SchoolCard from '../components/school-card'
import SchoolModal from '../components/school-modal'
import { getSchools } from '../data/schools'
import Page from '../page'

const SchoolsPage: React.FC = () => {
	const { data: schools, isLoading } = useQuery('schools', getSchools)
	const [modalOpen, setModalOpen] = useState(false)

	return (
		<Page authorized header={<AppHeader />}>
			<PageHeader
				title='Schools'
				search={() => {}}
				actions={[{ icon: NewSchoolIcon, action: () => setModalOpen(true) }]}
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

				{schools?.adminSchools.map((school) => (
					<Skeleton key={school.id.toString()} visible={isLoading}>
						<SchoolCard
							name={school.name}
							href={`./${school.id}`}
							image='https://images.unsplash.com/photo-1647708941340-fd3a55d5fc87?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2560&q=80'
						/>
					</Skeleton>
				))}
			</SimpleGrid>

			<SchoolModal opened={modalOpen} onClose={() => setModalOpen(false)} />
		</Page>
	)
}

export default SchoolsPage
