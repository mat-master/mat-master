import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Group, Text } from '@mantine/core'
import type React from 'react'
import { useState } from 'react'
import {
	DefaultValues,
	FieldValues,
	SubmitHandler,
	useForm,
	UseFormReturn,
} from 'react-hook-form'
import { z } from 'zod'
import getErrorMessage from '../utils/get-error-message'

type BaseFormProps<T extends FieldValues> = {
	schema: z.ZodSchema<T>
	onSubmit?: SubmitHandler<T>
	child: React.FC<{ form: UseFormReturn<T> }>
	error?: string
	defaultValues?: Partial<T>
	submitLabel?: string
}

export type FormProps<T extends FieldValues = FieldValues> = Omit<
	JSX.IntrinsicElements['form'],
	keyof BaseFormProps<T>
> &
	BaseFormProps<T>

export type FormWrapperProps<T extends FieldValues = FieldValues> = Omit<
	FormProps<T>,
	'schema' | 'child'
>

const Form = <T extends FieldValues>({
	schema,
	onSubmit,
	child: Child,
	error,
	defaultValues,
	submitLabel = 'Save',
	...props
}: FormProps<T>) => {
	const form = useForm<T>({
		resolver: zodResolver(schema) as any,
		defaultValues: defaultValues as DefaultValues<T>,
	})

	const { isSubmitting } = form.formState
	const [globalError, setGlobalError] = useState<string>()
	const handleSubmit = form.handleSubmit(
		(data) => {
			setGlobalError(undefined)
			if (onSubmit) return onSubmit(data)
		},
		(err) => err && setGlobalError(getErrorMessage(err))
	)

	return (
		<form {...props} onSubmit={handleSubmit}>
			<Group direction='column' spacing='sm' grow>
				<Child form={form} />
				<Button type='submit' loading={isSubmitting} ml='auto'>
					{submitLabel}
				</Button>
				{(error || globalError) && (
					<Text color='red' align='center'>
						{error ?? globalError}
					</Text>
				)}
			</Group>
		</form>
	)
}

export default Form
