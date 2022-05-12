import type {
	Address,
	KioskLoginPostBody,
	LoginPostBody,
	MembershipInterval,
	School,
	SchoolAttendancePostBody,
	SchoolClassesPostBody,
	SchoolInvitesDeleteBody,
	SchoolInvitesPostBody,
	SchoolKioskPatchBody,
	SchoolMembershipsPostBody,
	SchoolPostBody,
	SchoolStudentsMembershipsPutBody,
	SignupPostBody,
	Snowflake,
	Student,
	User,
	UserPatchBody,
	VerifyPostBody,
} from '@common/types'
import { array, date, mixed, number, object, SchemaOf, string } from 'yup'

export const snowflakeSchema: SchemaOf<Snowflake> = mixed().required()

export const userSchema: SchemaOf<User> = object({
	id: number().required() as unknown as SchemaOf<bigint>,
	firstName: string().required(),
	lastName: string().required(),
	email: string().email().required(),
	privilege: number().integer().required(),
	phone: string().notRequired(),
	avatar: snowflakeSchema.optional(),
})

export const addressSchema: SchemaOf<Address> = object({
	state: string().length(2).required(),
	city: string().required(),
	postalCode: string().length(5).required(),
	line1: string().required(),
	line2: string().optional(),
})

export const schoolSchema: SchemaOf<School> = object({
	id: snowflakeSchema,
	owner: snowflakeSchema,
	name: string().required(),
	address: addressSchema,
	stripeAccountId: string().required(),
	stripeSubscriptionId: string().required(),
	tier: number().integer().required(),
})

export const studentSchema: SchemaOf<Student> = object({
	id: snowflakeSchema,
	school: snowflakeSchema,
	user: userSchema,
	stripeCustomerId: string().required(),
})

export const classTimeSchema = object({
	schedule: string().required('Required'),
	duration: number().integer().positive().required(),
})

export const membershipIntervalSchema: SchemaOf<MembershipInterval> = mixed()
	.oneOf(['day', 'week', 'month', 'year'])
	.required();

export namespace api {
	export const signupPostSchema: SchemaOf<SignupPostBody> = object({
		firstName: string().required(),
		lastName: string().required(),
		email: string().email().required(),
		password: string().min(6).required(),
	})

	export const loginPostSchema: SchemaOf<LoginPostBody> = object({
		email: string().email().required(),
		password: string().min(6).required(),
	})

	export const verifyPostSchema: SchemaOf<VerifyPostBody> = object({
		token: string().required(),
	})

	export const schoolPostSchema: SchemaOf<SchoolPostBody> = object({
		name: string().required(),
		address: addressSchema.required(),
	})

	export const schoolClassesPostSchema: SchemaOf<SchoolClassesPostBody> = object({
		name: string().required(),
		schedule: array().of(classTimeSchema).min(1).required(),
	})

	export const schoolMembershipsPostSchema: SchemaOf<SchoolMembershipsPostBody> = object({
		name: string().required(),
		classes: array().of(snowflakeSchema).min(1).required(),
		price: number().positive().required(),
		interval: membershipIntervalSchema.required(),
		intervalCount: number().integer().required(),
	})

	export const schoolStudentsMembershipsPutSchema: SchemaOf<SchoolStudentsMembershipsPutBody> = object({
		memberships: array().of(snowflakeSchema).min(1).required()
	});

	export const schoolInvitesPostSchema: SchemaOf<SchoolInvitesPostBody> = object({
		email: string().email().required(),
	})
	export const schoolInvitesDeleteSchema: SchemaOf<SchoolInvitesDeleteBody> = object({
		email: string().email().required(),
	})

	export const schoolAttendancePostSchema: SchemaOf<SchoolAttendancePostBody> = object({
		student: snowflakeSchema.required(),
		classes: array().of(snowflakeSchema).required(),
		date: date().required()
	})	

	const pinSchema = string().matches(/^[0-9]{6,}$/).required()

	export const schoolKioskPatchSchema: SchemaOf<SchoolKioskPatchBody> = object({
		pin: pinSchema.required()
	});

	export const kioskLoginPostSchema: SchemaOf<KioskLoginPostBody> = object({
		school: snowflakeSchema.required(),
		pin: pinSchema.required()
	});

	export const userPatchSchema: SchemaOf<UserPatchBody> = object({
		firstName: string().optional(),
		lastName: string().optional(),
		avatar: string().optional()
	}).test("Has-Field", "At least one field must be present", value => Object.keys(value).length > 0)
}
