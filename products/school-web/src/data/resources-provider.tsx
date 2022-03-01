import type React from 'react';
import type { ClassTime } from '../utils/class-time-serialization';
import ResourceProvider, { createResourceContext, RemoteResource } from './resource-context';

export type ActivityStatus = 'active' | 'inactive' | 'deleted';

export interface Student extends RemoteResource {
	activityStatus: ActivityStatus;
	memberships: Array<string>;
}

export interface StudentSummary extends RemoteResource {
	name: string;
	activityStatus: ActivityStatus;
	memberships: Array<string>;
}

export interface Class extends RemoteResource {
	name: string;
	memberships: string[];
	schedule: ClassTime[];
}

export interface ClassSummary extends RemoteResource {
	name: string;
	studentAvatars: Array<string | undefined>;
	memberships: Array<string>;
	schedule: string;
}

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

export const studentsContext = createResourceContext<Student, StudentSummary>();
export const classesContext = createResourceContext<Class, ClassSummary>();
export const membershipsContext = createResourceContext<Membership, MembershipSummary>();

const testStudents = Array<Student>(36).fill({
	id: '7439yh',
	activityStatus: 'active',
	memberships: ['4893hfueowa'],
});

const testStudentSummaries = Array<StudentSummary>(36).fill({
	id: '7439yh',
	name: 'John Doe',
	activityStatus: 'active',
	memberships: ['Basic'],
});

const testClasses = Array<Class>(6).fill({
	id: '483hfewi',
	name: 'TaeKwonDo',
	memberships: ['4893hfueowa'],
	schedule: [' 0 18 * * 1 : 60', ' 0 18 * * 3 : 60'],
});

const testClassSummaries = Array<ClassSummary>(6).fill({
	id: '483hfewi',
	name: 'TaeKwonDo',
	memberships: Array(3).fill('Basic'),
	schedule: '2 classes per week',
	studentAvatars: Array(6).fill(undefined),
});

const testMemberships = Array<Membership>(8).fill({
	id: '4893hfueowa',
	name: 'Basic',
	classes: Array(3).fill('483hfewi'),
	students: Array(12).fill('7439yh'),
	price: 100,
});

const testMembershipSummaries = Array<MembershipSummary>(8).fill({
	id: '4893hfueowa',
	name: 'Basic',
	classes: Array(3).fill('TaeKwonDo'),
	studentAvatars: Array(12).fill(undefined),
	price: 100,
});

const ResourcesProvider: React.FC = ({ children }) => (
	<ResourceProvider
		context={studentsContext}
		defaultItems={testStudents}
		defaultSummaries={testStudentSummaries}
	>
		<ResourceProvider
			context={classesContext}
			defaultItems={testClasses}
			defaultSummaries={testClassSummaries}
		>
			<ResourceProvider
				context={membershipsContext}
				defaultItems={testMemberships}
				defaultSummaries={testMembershipSummaries}
			>
				{children}
			</ResourceProvider>
		</ResourceProvider>
	</ResourceProvider>
);

export default ResourcesProvider;
