import { createResourceContext, RemoteResource } from './resource-provider';

export type ActivityStatus = 'active' | 'inactive' | 'deleted';

export interface Student extends RemoteResource {
	memberships: Array<string>;
}

export interface StudentSummary extends RemoteResource {
	name: string;
	activityStatus: ActivityStatus;
	memberships: Array<string>;
}

export const testStudents = Array<Student>(36).fill({
	id: '7439yh',
	memberships: ['4893hfueowa'],
});

export const testStudentSummaries = Array<StudentSummary>(36).fill({
	id: '7439yh',
	name: 'John Doe',
	activityStatus: 'active',
	memberships: ['Basic'],
});

const studentsContext = createResourceContext<Student, StudentSummary>();

export default studentsContext;
