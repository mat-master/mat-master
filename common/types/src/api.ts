import type { Address } from './address';
import type { Class, ClassTime, Membership, MembershipInterval, School, Student, Tier } from './school';
import type { Card, User } from './user';

export type Snowflake = bigint | string;

export interface SignupPostBody {
	firstName: string
	lastName: string
	email: string
	password: string
}

export interface LoginPostBody {
	email: string
	password: string
}
export interface LoginPostResponse {
	jwt: string
}

export interface VerifyPostBody {
	token: string
}

export interface VerifyPostResponse {
	jwt: string
}

export interface RefreshPostResponse {
	jwt: string
}

// Schools

export interface SchoolPostBody {
	name: string
	address: Address
}
export interface SchoolPostResponse {
	id: Snowflake,
	name: string,
	address: Address,
	tier: Tier
};

export type SchoolGetResponse = School;

export type SchoolClassesGetResponse = Class[];

export interface SchoolClassesPostBody {
	name: string,
	schedule: ClassTime[]
}

export interface SchoolMembershipsPostBody {
	name: string,
	classes: Snowflake[],
	price: number,
	interval: MembershipInterval,
	intervalCount: number
}

export type SchoolMembershipsGetResponse = Membership[];

export type SchoolInvitesGetResponse = string[];
export interface SchoolInvitesPostBody {
	email: string
}
export interface SchoolInvitesDeleteBody {
	email: string
}

export type SchoolJoinPostResponse = void | string;

export type SchoolStudentsGetResponse = Student[];

export interface SchoolAttendancePostBody {
	student: Snowflake,
	classes: Snowflake[],
	date: Date
}

export interface SchoolStudentsMembershipsPutBody {
	memberships: Snowflake[]
}

export interface SchoolStudentsPatchBody {
	memberships?: Snowflake[],
}

export type SchoolStudentsIdGetResponse = Student;

export interface SchoolKioskPatchBody {
	pin: string
}

// Kiosk

export interface KioskLoginPostBody {
	school: Snowflake,
	pin: string
}

export interface KioskLoginPostResponse {
	jwt: string
}

// Users

export type UserGetResponse = User;

export type UserPatchBody = {
	firstName?: string,
	lastName?: string,
	avatar?: string
}

export type UserInvitesGetResponse = bigint[];

export interface UserSchoolsGetResponse {
	adminSchools: School[],
	studentSchools: School[]
}

export type UserBillingGetResponse = Card[];

export interface UserBillingPostResponse {
	stripeClientId: string
}