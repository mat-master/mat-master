import { createResourceContext, RemoteResource } from './resource-provider';

export interface Membership extends RemoteResource {
	name: string;
	classes: string[];
	students: string[];
	price: number;
}

export interface MembershipSummary extends RemoteResource {
	name: string;
	classes: string[];
	studentAvatars: Array<string | undefined>;
	price: number;
}

export const testMemberships = Array<Membership>(8).fill({
	id: '4893hfueowa',
	name: 'Basic',
	classes: Array(3).fill('483hfewi'),
	students: Array(12).fill('7439yh'),
	price: 100,
});

export const testMembershipSummaries = Array<MembershipSummary>(8).fill({
	id: '4893hfueowa',
	name: 'Basic',
	classes: Array(3).fill('TaeKwonDo'),
	studentAvatars: Array(12).fill(undefined),
	price: 100,
});

const membershipsContext = createResourceContext<Membership, MembershipSummary>();

export default membershipsContext;
