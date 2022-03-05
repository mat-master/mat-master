import type { SchemaOf } from 'yup'

export type MappedErrors<T> = { [_ in keyof T]?: string }

export const getSynchronousErrorMessage = (error: unknown) => {
	if (typeof error === 'string') {
		return error
	} else if (error instanceof Error) {
		return error.message
	} else {
		return 'An unknown error ocurred'
	}
}

const getErrorMessage = async <T>(error: unknown, schema?: SchemaOf<MappedErrors<T>>) => {
	if (typeof error === 'string') {
		return error
	} else if (error instanceof Error) {
		return error.message
	} else if (schema && (await schema.validate(error))) {
		return error as MappedErrors<T>
	} else {
		return 'An unknown error ocurred'
	}
}

export default getErrorMessage
