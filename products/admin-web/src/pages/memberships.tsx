import React from 'react';
import PageHeader from '../components/page-header';

interface Membership {
	id: string;
	name: string;
}

export const memberships: Membership[] = [
	{ id: '723r5', name: 'basic' },
	{ id: '289ry', name: 'advanced' },
];

const MembershipsPage: React.FC = () => {
	return <PageHeader title='Memberships' />;
};

export default MembershipsPage;
