import { Avatar, AvatarsGroup, Paper, Title } from '@mantine/core';
import type React from 'react';
import { useMemo } from 'react';
import { Plus as PlusIcon } from 'react-feather';
import ItemMenu from '../components/item-menu';
import PageHeader from '../components/page-header';
import Table from '../components/table';
import useSearchTerm from '../hooks/use-search-term';

interface Membership {
	id: string;
	name: string;
	classes: string[];
	students: string[];
	price: number;
}

export const memberships = Array<Membership>(24).fill({
	id: '4739gqqwf',
	name: 'Basic',
	classes: ['TaeKwonDo', 'JiuJitsu'],
	students: Array(8).fill(''),
	price: 100,
});

const MembershipsPage: React.FC = () => {
	const [searchTerm, setSearchTerm] = useSearchTerm();
	const filteredMemberships = useMemo(
		() =>
			memberships.filter(({ name }) => name.toLowerCase().includes(searchTerm.toLowerCase())),
		[searchTerm]
	);

	return (
		<>
			<PageHeader
				title='Memberships'
				search={setSearchTerm}
				searchTerm={searchTerm}
				actions={[{ icon: <PlusIcon size={18} />, action: () => {} }]}
			/>

			<Paper shadow='sm' withBorder>
				<Table<keyof (Membership & { menu: never })>
					columns={[
						{ key: 'name', name: 'Name', width: 2 },
						{ key: 'classes', name: 'Classes', width: 3 },
						{ key: 'students', name: 'Students', width: 3 },
						{ key: 'price', name: 'Price', width: 1 },
						{ key: 'menu', name: '', width: 0.5 },
					]}
					items={filteredMemberships.map((membership) => ({
						data: {
							name: <Title order={6}>{membership.name}</Title>,
							classes: membership.classes.join(', '),
							students: (
								<AvatarsGroup limit={4}>
									{membership.students.map((_, i) => (
										<Avatar key={i} />
									))}
								</AvatarsGroup>
							),
							price: `$${membership.price} / mo.`,
							menu: <ItemMenu />,
						},
					}))}
					itemPadding={4}
				/>
			</Paper>
		</>
	);
};

export default MembershipsPage;
