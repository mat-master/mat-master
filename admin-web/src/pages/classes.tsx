import { Paper, Title } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import React from 'react';
import { Plus as PlusIcon } from 'react-feather';
import ConfirmationModal from '../components/confirmation-modal';
import ItemMenu from '../components/item-menu';
import PageHeader from '../components/page-header';
import Table from '../components/table';
import useSearchTerm from '../hooks/use-search-tem';

interface ClassSummary {
	name: string;
	studentsCount: number;
	membershipsCount: number;
	weeklyClassesCount: number;
}

interface ClassesPageModals {
	deleteConfirmation?: string | undefined;
}

const classes = Array<ClassSummary>(36).fill({
	name: 'TaeKwonDo',
	studentsCount: 12,
	membershipsCount: 3,
	weeklyClassesCount: 2,
});

const ClassesPage: React.FC = () => {
	const [searchTerm, setSearchTerm] = useSearchTerm('');
	const [modals, setModals] = useSetState<ClassesPageModals>({});

	return (
		<>
			<PageHeader
				title='Classes'
				search={setSearchTerm}
				actions={[{ icon: <PlusIcon size={18} />, action: () => {} }]}
			/>

			<Paper shadow='md' withBorder>
				<Table<ClassSummary & { menu: never }>
					columns={[
						{ key: 'name', name: 'Name', width: 3 },
						{ key: 'studentsCount', name: 'Students', width: 2 },
						{ key: 'membershipsCount', name: 'Included In', width: 3 },
						{ key: 'weeklyClassesCount', name: 'Classes Per Week', width: 2 },
						{ key: 'menu', name: '', width: 0.5 },
					]}
					items={classes
						.filter((classSummary) =>
							classSummary.name.toLowerCase().includes(searchTerm.toLowerCase())
						)
						.map(({ name, studentsCount, membershipsCount, weeklyClassesCount }) => ({
							name: <Title order={6}>{name}</Title>,
							studentsCount: `${studentsCount} students`,
							membershipsCount: `Included in ${membershipsCount} memberships`,
							weeklyClassesCount: `${weeklyClassesCount} classes per week`,
							menu: <ItemMenu onDelete={() => setModals({ deleteConfirmation: name })} />,
						}))}
				/>
			</Paper>

			<ConfirmationModal
				resourceType='class'
				open={!!modals.deleteConfirmation}
				action={() => new Promise((resolve) => setTimeout(resolve, 2000))}
				onClose={() => setModals({ deleteConfirmation: undefined })}
			/>
		</>
	);
};

export default ClassesPage;
