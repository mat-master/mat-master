import type { Address } from './address';
import type { Class, ClassTime, School, Student, Tier } from './school';
import type { User } from './user';
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

// Schools

export interface SchoolPostBody {
	name: string
	address: Address
}
export interface SchoolPostResponse {
	id: string,
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

export type SchoolInvitesGetResponse = string[];
export interface SchoolInvitesPostBody {
	email: string
}
export interface SchoolInvitesDeleteBody {
	email: string
}

export type SchoolJoinPostResponse = void | string;

export type SchoolStudentsGetResponse = Student[];

// Users

export type UserGetResponse = User;

export type UserInvitesGetResponse = bigint[];