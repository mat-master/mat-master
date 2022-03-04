import type { SchemaOf } from 'yup'

const getErrorMessage = async <T>(error: unknown, schema?: SchemaOf<T>) => {
	if (typeof error === 'string') {
		return error
	} else if (error instanceof Error) {
		return error.message
	} else if (schema && (await schema.validate(error))) {
		return error as T
	} else {
		return 'An unknown error ocurred'
	}
}

export default getErrorMessage
