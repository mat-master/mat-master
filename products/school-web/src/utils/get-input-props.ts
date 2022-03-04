import type React from 'react'

interface FormHandlers<T> {
	errors: { [_ in keyof T]?: string }
	validateField: (field: keyof T) => any
	handleChange: (e: React.ChangeEvent<any>) => any
	handleBlur: (e: React.FocusEvent) => any
}

const getInputProps = <T>(form: FormHandlers<T>, id: keyof T) => {
	const error = form.errors[id]

	const onChange = (e: React.ChangeEvent<any>) => {
		if (error) form.validateField(id)
		form.handleChange(e)
	}

	const onBlur = (e: React.FocusEvent) => {
		form.validateField(id)
		form.handleBlur(e)
	}

	return { id, error, onChange, onBlur }
}

export default getInputProps
