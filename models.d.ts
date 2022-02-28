interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
}

type ActivityStatus = 'active' | 'inactive' | 'deleted';

interface Student {
	id: string;
	user: string;
	school: string;
	activityStatus: ActivityStatus;
	memberships: Array<string>;
	data: { [key: string]: any };
}

interface StudentSummary {
	id: string;
	name: string;
	activityStatus: ActivityStatus;
	memberships: Array<string>;
}

interface Class {
	id: string;
	school: string;
	name: string;
	schedule: string;
	duration: number;
}

interface ClassSummary {
	id: string;
	name: string;
	studentAvatars: string[];
	memberships: Array<string>;
	schedule: string;
}

interface Membership {
	id: string;
	school: string;
	name: string;
	billingPeriod: number;
	price: number;
}

interface MembershipSummary {
	id: string;
	name: string;
	classes: Array<string>;
	studentAvatars: Array<string>;
	billing: string;
}

interface School {
	id: string;
	name: string;
}
