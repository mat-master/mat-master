import { Button, Center, SimpleGrid } from '@mantine/core'
import type React from 'react'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router'
import { Apps as NewSchoolIcon } from 'tabler-icons-react'
import AppHeader from '../components/app-header'
import PageHeader from '../components/page-header'
import SchoolModal from '../components/school-modal'
import { getSchools } from '../data/schools'
import Page from '../page'

const SchoolsPage: React.FC = () => {
	const { data } = useQuery('schools', getSchools)
	const navigate = useNavigate()
	const [modalOpen, setModalOpen] = useState(false)

	return (
		<Page header={<AppHeader />}>
			<PageHeader
				title='Schools'
				search={() => {}}
				actions={[{ icon: NewSchoolIcon, action: () => {} }]}
			/>
			<Center mt='xl'>
				<SimpleGrid cols={3}>
					{data?.adminSchools.map((school) => (
						<Button onClick={() => navigate(`./${school.id}`)}>{school.name}</Button>
					))}
				</SimpleGrid>
			</Center>

			<SchoolModal opened={modalOpen} onClose={() => setModalOpen(false)} />
		</Page>
	)
}

export default SchoolsPage
