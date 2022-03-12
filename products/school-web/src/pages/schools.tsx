import { Button, Center, Group, Paper, Title } from '@mantine/core'
import type React from 'react'
import { useState } from 'react'
import { Plus as PlusIcon } from 'react-feather'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router'
import SchoolModal from '../components/school-modal'
import { getSchools } from '../data/schools'

const SchoolsPage: React.FC = () => {
	const { data } = useQuery('schools', getSchools)
	const navigate = useNavigate()
	const [modalOpen, setModalOpen] = useState(false)

	return (
		<>
			<Center mt='xl'>
				<Group direction='column' grow>
					{data &&
						data.adminSchools.map((school) => (
							<Paper
								key={school.id.toString()}
								padding='lg'
								shadow='sm'
								withBorder
								onClick={() => navigate(`./${school.id.toString()}`)}
							>
								<Title order={3}>{school.name}</Title>
							</Paper>
						))}
					<Button leftIcon={<PlusIcon size={18} />} onClick={() => setModalOpen(true)}>
						New School
					</Button>
				</Group>
			</Center>

			<SchoolModal opened={modalOpen} onClose={() => setModalOpen(false)} />
		</>
	)
}

export default SchoolsPage
