import type { Address, LoginPostBody, SignupPostBody, User } from '@common/types'
import { array, number, object, SchemaOf, string } from 'yup'

export const userSchema: SchemaOf<User> = object({
	id: number().required() as unknown as SchemaOf<bigint>,
	firstName: string().required(),
	lastName: string().required(),
	email: string().email().required(),
	privilege: number().integer().required(),
	phone: string().notRequired(),
})

export const signupSchema: SchemaOf<SignupPostBody> = object({
	firstName: string().required(),
	lastName: string().required(),
	email: string().email().required(),
	password: string().min(6).required(),
})

export const loginSchema: SchemaOf<LoginPostBody> = object({
	email: string().email().required(),
	password: string().min(6).required(),
})

export const addressSchema: SchemaOf<Address> = object({
	state: string().required(),
	city: string().required(),
	postalCode: string().length(5).required(),
	line1: string().required(),
	line2: string().optional(),
})

export const schoolCreateSchema = object({
	name: string().required(),
	address: addressSchema.required(),
})

export const schoolInviteSchema = object({
	email: string().email().required(),
})

export const classTimeSchema = object({
	schedule: string().required('Required'),
	duration: number().integer().positive().required(),
})

export const classCreateSchema = object({
	name: string().required(),
	schedule: array().of(classTimeSchema).min(1).required(),
})
