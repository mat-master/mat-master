import { z } from 'zod'

/** Privilege levels */
export enum Privilege {
	/** Unverified email */
	Unverified,

	/** Verified email, normal user */
	Verified,

	/** Admin user */
	Admin,
}

export const privilegeSchema = z.nativeEnum(Privilege)
