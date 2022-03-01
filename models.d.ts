interface User {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
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
