import { SimpleGrid } from '@mantine/core'
import type React from 'react'
import {
	CurrencyDollar,
	ListCheck as AttendanceIcon,
	UserPlus as NewStudentsIcon,
} from 'tabler-icons-react'
import PageHeader from '../../components/page-header'
import StatCard from '../../components/stat-card'

const DashboardPage: React.FC = () => {
	return (
		<>
			<PageHeader title='Dashboard' />
			<SimpleGrid
				cols={4}
				breakpoints={[
					{ maxWidth: 'md', cols: 2 },
					{ maxWidth: 'xs', cols: 1 },
				]}
			>
				<StatCard
					title='Revenue'
					icon={CurrencyDollar}
					value={3260}
					previousValue={3000}
					units='dollars'
				/>
				<StatCard title='New Students' icon={NewStudentsIcon} value={8} previousValue={6} />
				<StatCard
					title='Attendance Rate'
					icon={AttendanceIcon}
					value={89}
					previousValue={89}
					units='percent'
				/>
				<StatCard title='Your Mom' icon={NewStudentsIcon} value={183} previousValue={208} />
			</SimpleGrid>
		</>
	)
}

export default DashboardPage
