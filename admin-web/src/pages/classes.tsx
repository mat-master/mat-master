import { Paper, Title } from '@mantine/core';
import React from 'react';
import PageHeader from '../components/page-header';
import Table from '../components/table';

interface ClassSummary {
	name: string;
	studentsCount: number;
	membershipsCount: number;
	weeklyClassesCount: number;
}

const ClassesPage: React.FC = () => {
	const classes = Array<ClassSummary>(36).fill({
		name: 'TaeKwonDo',
		studentsCount: 12,
		membershipsCount: 3,
		weeklyClassesCount: 2,
	});

	return (
		<>
			<PageHeader title='Classes' />

			<Paper shadow='md' withBorder>
				<Table<ClassSummary>
					columns={[
						{ key: 'name', name: 'Name', width: 3 },
						{ key: 'studentsCount', name: 'Students', width: 2 },
						{ key: 'membershipsCount', name: 'Included In', width: 3 },
						{ key: 'weeklyClassesCount', name: 'Classes Per Week', width: 2 },
					]}
					items={classes.map(
						({ name, studentsCount, membershipsCount, weeklyClassesCount }) => ({
							name: <Title order={5}>{name}</Title>,
							studentsCount: `${studentsCount} students`,
							membershipsCount: `Included in ${membershipsCount} memberships`,
							weeklyClassesCount: `${weeklyClassesCount} classes per week`,
						})
					)}
				/>
			</Paper>
		</>
	);
};

export default ClassesPage;
