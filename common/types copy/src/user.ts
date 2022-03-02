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
};

/** Privilege levels */
export enum Privilege {
	/** Unverified email */
	Unverified = 0,

	/** Verified email, normal user */
	Normal = 1,

	/** Admin user */
	Admin = 2
};