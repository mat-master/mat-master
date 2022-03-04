import type { Address } from "@common/types";
import { object, ObjectSchema, SchemaOf, string } from "yup"

export const signupSchema = object({
    firstName: string().required(),
    lastName: string().required(),
    email: string().email().required(),
    password: string().min(6).required()
});

export const loginSchema = object({
    email: string().email().required(),
    password: string().min(6).required()
});

export const addressSchema: SchemaOf<Address> = object({
    state: string().required(),
    city: string().required(),
    postalCode: string().length(5).required(),
    line1: string().required(),
    line2: string().optional()
});

export const schoolCreateSchema = object({
    name: string().required(),
    address: addressSchema.required()
});

export const schoolInviteSchema = object({
    email: string().email().required()
});