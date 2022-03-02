export interface Address {
	state: string;
	city: string;
	postalCode: string;
	line1: string;
	line2?: string;
}

export interface School {
	id: string;
	name: string;
	address: Address;
}

export type StudentStatus = 'active' | 'inactive' | 'deleted';

export interface SutudentSummary {
	/** Student id */
	id: string;

	/** Student name */
	name: string;

	/** The students activity status in the current school */
	status: StudentStatus;

	/** List of students active memberships at the current school */
	memberships: string[];
}

export interface ClassSummary {
	/** Class id */
	id: string;

	/** Class display name */
	name: string;

	/** List student ID's that have access to this class through a membership */
	students: string[];

	/** List of membership display names that include this class */
	memberships: string[];

	/** User-readable schedule string */
	schedule: string;
}

export interface MembershipSummary {
	/** Membership id */
	id: string;

	/** Membership display name */
	name: string;

	/** List of class display names that are included in this membership */
	classes: string[];

	/** List of student IDs that are subscribed to this membership */
	students: string[];
}

export * from './api'
export * from './user'