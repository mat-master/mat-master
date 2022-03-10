import type { Address, LoginPostBody, SignupPostBody, VerifyPostBody, User, SchoolPostBody, SchoolClassesPostBody, SchoolInvitesPostBody, SchoolInvitesDeleteBody } from '@common/types'
import { array, number, object, SchemaOf, string } from 'yup'

export const userSchema: SchemaOf<User> = object({
	id: number().required() as unknown as SchemaOf<bigint>,
	firstName: string().required(),
	lastName: string().required(),
	email: string().email().required(),
	privilege: number().integer().required(),
	phone: string().notRequired(),
});

export const addressSchema: SchemaOf<Address> = object({
	state: string().required(),
	city: string().required(),
	postalCode: string().length(5).required(),
	line1: string().required(),
	line2: string().optional(),
});

export const classTimeSchema = object({
	schedule: string().required('Required'),
	duration: number().integer().positive().required(),
})

export namespace api {
	export const signupPostSchema: SchemaOf<SignupPostBody> = object({
		firstName: string().required(),
		lastName: string().required(),
		email: string().email().required(),
		password: string().min(6).required(),
	});

	export const loginPostSchema: SchemaOf<LoginPostBody> = object({
		email: string().email().required(),
		password: string().min(6).required(),
	});

	export const verifyPostSchema: SchemaOf<VerifyPostBody> = object({
		token: string().required(),
	});

	export const schoolPostSchema: SchemaOf<SchoolPostBody> = object({
		name: string().required(),
		address: addressSchema.required(),
	});

	export const schoolClassesPostSchema: SchemaOf<SchoolClassesPostBody> = object({
		name: string().required(),
		schedule: array().of(classTimeSchema).min(1).required(),
	});

	export const schoolInvitesPostSchema: SchemaOf<SchoolInvitesPostBody> = object({
		email: string().email().required(),
	})
	export const schoolInvitesDeleteSchema: SchemaOf<SchoolInvitesDeleteBody> = object({
		email: string().email().required(),
	})

}