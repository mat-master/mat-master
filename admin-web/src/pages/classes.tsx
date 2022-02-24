import { Avatar, AvatarsGroup, Paper, Title } from '@mantine/core';
import { useSetState } from '@mantine/hooks';
import React from 'react';
import { Plus as PlusIcon } from 'react-feather';
import ClassEditModal from '../components/class-edit-modal';
import ConfirmationModal from '../components/confirmation-modal';
import ItemMenu from '../components/item-menu';
import PageHeader from '../components/page-header';
import Table from '../components/table';
import useSearchTerm from '../hooks/use-search-tem';

interface ClassSummary {
	id: string;
	name: string;
	students: number;
	memberships: string[];
	weeklyClassesCount: number;
}

interface ClassesPageModals {
	edit?: string | undefined;
	deleteConfirmation?: string | undefined;
}

const classes = Array<ClassSummary>(36).fill({
	id: '3s564',
	name: 'TaeKwonDo',
	students: 12,
	memberships: ['Basic', 'Advanced'],
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
				<Table<keyof (ClassSummary & { menu: never })>
					columns={[
						{ key: 'name', name: 'Name', width: 2 },
						{ key: 'students', name: 'Students', width: 2 },
						{ key: 'memberships', name: 'Memberships', width: 3 },
						{ key: 'weeklyClassesCount', name: 'Classes', width: 2 },
						{ key: 'menu', name: '', width: 0.5 },
					]}
					items={classes
						.filter((classSummary) =>
							classSummary.name.toLowerCase().includes(searchTerm.toLowerCase())
						)
						.map(({ id, name, memberships, weeklyClassesCount }) => ({
							data: {
								name: <Title order={6}>{name}</Title>,
								students: (
									<AvatarsGroup limit={4} spacing='xl'>
										<Avatar />
										<Avatar />
										<Avatar />
										<Avatar />
										<Avatar />
										<Avatar />
										<Avatar />
									</AvatarsGroup>
								),
								memberships: memberships.join(', '),
								weeklyClassesCount: `${weeklyClassesCount} per week`,
								menu: (
									<ItemMenu
										onEdit={() => setModals({ edit: id })}
										onDelete={() => setModals({ deleteConfirmation: id })}
									/>
								),
							},
						}))}
					itemPadding={4}
				/>
			</Paper>

			<ClassEditModal open={!!modals.edit} onClose={() => setModals({ edit: undefined })} />
			<ConfirmationModal
				resourceType='class'
				open={!!modals.deleteConfirmation}
				action={() => new Promise((resolve) => setTimeout(resolve, 2000))}
				onClose={() => setModals({ deleteConfirmation: undefined })}
				workingMessage='Deleting class...'
				successMessage='Class deleted'
			/>
		</>
	);
};

export default ClassesPage;
