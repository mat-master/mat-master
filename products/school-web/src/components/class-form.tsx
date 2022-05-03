import type { SchoolClassesPostBody } from '@common/types'
import { validator } from '@common/util'
import { yupResolver } from '@hookform/resolvers/yup'
import { Center, Loader, Text, TextInput } from '@mantine/core'
import type React from 'react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { createClass, getClass } from '../data/classes'
import getErrorMessage from '../utils/get-error-message'
import ClassScheduleInput from './class-schedule-input'
import { defaultClassTime } from './class-time-input'
import Form, { FormProps } from './form'

export type ClassFormProps = Omit<FormProps, 'onSubmit'> & {
	defaultValues?: SchoolClassesPostBody
	onSubmit?: (
		e: React.FormEvent<HTMLFormElement>,
		values: SchoolClassesPostBody
	) => void
}

export const ClassForm: React.FC<ClassFormProps> = ({
	defaultValues,
	onSubmit,
	...props
}) => {
	const form = useForm<SchoolClassesPostBody>({
		mode: 'onBlur',
		resolver: yupResolver(validator.api.schoolClassesPostSchema),
		defaultValues: {
			name: '',
			schedule: [{ duration: 60, schedule: '* * * * *' }],
			...defaultValues,
		},
	})

	const { isDirty, isValid } = form.formState
	const [globalError, setGlobalError] = useState<string>()

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) =>
		form.handleSubmit(
			async (values) => onSubmit && (await onSubmit(e, values)),
			(error) => setGlobalError(getErrorMessage(error))
		)(e)

	return (
		<Form
			canSubmit={isDirty && isValid}
			error={globalError}
			{...props}
			onSubmit={handleSubmit}
		>
			<TextInput
				label='Name'
				{...form.register('name')}
				error={form.formState.errors.name?.message}
			/>
			<Controller
				name='schedule'
				control={form.control}
				defaultValue={[defaultClassTime]}
				render={({ field, fieldState }) => (
					<ClassScheduleInput
						label='Schedule'
						error={fieldState.error?.message}
						{...field}
					/>
				)}
			/>
		</Form>
	)
}

export type RemoteClassFormProps = FormProps & {
	id?: string
}

export const RemoteClassForm: React.FC<RemoteClassFormProps> = ({
	id,
	onSubmit,
	...props
}) => {
	const queryKey = ['classes', { id }] as const
	const { data, isLoading, isError, error } = useQuery(
		queryKey,
		() => getClass(id!),
		{
			enabled: !!id,
		}
	)

	const queryClient = useQueryClient()
	const { mutateAsync } = useMutation(
		queryKey,
		(values: SchoolClassesPostBody) => {
			if (!id) return createClass(values)
			throw 'Unimplemented'
		},
		{ onSuccess: () => queryClient.invalidateQueries(queryKey[0]) }
	)

	if (isLoading || isError) {
		return (
			<Center>
				{isLoading && <Loader />}
				{isError && <Text color='red'>{getErrorMessage(error)}</Text>}
			</Center>
		)
	}

	return (
		<ClassForm
			{...props}
			defaultValues={data}
			onSubmit={async (e, values) => {
				await mutateAsync(values)
				onSubmit && (await onSubmit(e))
			}}
		/>
	)
}
