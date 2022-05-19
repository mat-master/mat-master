import type { Snowflake } from "./api";

export const AVATAR_URL = 'https://matmaster.s3.us-west-1.amazonaws.com';

export interface User {
	/** Universally unique user ID */
	id: bigint,

	/** The users first name */
	firstName: string,

	/** The users last name */
	lastName: string,

	/** The users email address */
	email: string,

	/** The users privilege level */
	privilege: Privilege,

	/** The users phone number */
	phone?: string,

	avatar?: Snowflake
};

/** Privilege levels */
export enum Privilege {
	/** Unverified email */
	Unverified = 0,

	/** Verified email, normal user */
	Verified = 1,

	/** Admin user */
	Admin = 2
};

export interface Card {
	id: string,
	brand: string,
	last4: string,
	expMonth: number,
	expYear: number
}