import type { ClassTime } from '../components/class-time-input';
import { createResourceContext, RemoteResource } from './resource-provider';

export interface Class extends RemoteResource {
	name: string;
	memberships: string[];
	schedule: (ClassTime | null)[];
}

export interface ClassSummary extends RemoteResource {
	name: string;
	studentAvatars: Array<string | undefined>;
	memberships: Array<string>;
	schedule: string;
}

export const testClasses = Array<Class>(6).fill({
	id: '483hfewi',
	name: 'TaeKwonDo',
	memberships: ['4893hfueowa'],
	schedule: [
		{ schedule: '0 18 * * 1', duration: 60 },
		{ schedule: '0 18 * * 3', duration: 60 },
	],
});

export const testClassSummaries = Array<ClassSummary>(6).fill({
	id: '483hfewi',
	name: 'TaeKwonDo',
	memberships: Array(3).fill('Basic'),
	schedule: '2 classes per week',
	studentAvatars: Array(6).fill(undefined),
});

const classesContext = createResourceContext<Class, ClassSummary>();

export default classesContext;
