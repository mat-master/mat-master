import type { SchemaOf } from 'yup'
import * as yup from 'yup'

export type MappedErrors<T> = { [_ in keyof T]?: string }

export const getErrorSchema = <T extends {}>(
	objectSchema: yup.SchemaOf<T>
): yup.SchemaOf<MappedErrors<T>> => {
	const errorSchema = { ...objectSchema }
	errorSchema.fields = Object.keys(objectSchema.fields)
		.map<[string, yup.StringSchema]>((key) => [key, yup.string().notRequired()])
		.reduce<yup.SchemaOf<MappedErrors<T>>>(
			(fields, [key, schema]) => ({ ...fields, [key]: schema }),
			{} as yup.SchemaOf<MappedErrors<T>>
		)

	return errorSchema
}

export const getSynchronousErrorMessage = (error: unknown) => {
	if (typeof error === 'string') {
		return error
	} else if (error instanceof Error) {
		return error.message
	} else {
		return 'An unknown error ocurred'
	}
}

const getErrorMessage = <T>(error: unknown, schema?: SchemaOf<T>) => {
	if (typeof error === 'string') {
		return error
	} else if (error instanceof Error) {
		return error.message
	} else if (schema && getErrorSchema(schema).validateSync(error)) {
		return error as MappedErrors<T>
	} else {
		return 'An unknown error ocurred'
	}
}

export default getErrorMessage
