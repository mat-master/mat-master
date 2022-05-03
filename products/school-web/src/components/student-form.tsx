import type { SchoolStudentsMembershipsPutBody } from '@common/types'
import { validator } from '@common/util'
import { yupResolver } from '@hookform/resolvers/yup'
import { Center, Loader, MultiSelect, Text } from '@mantine/core'
import type React from 'react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getStudent, updateStudentMemberships } from '../data/students'
import getErrorMessage from '../utils/get-error-message'
import Form, { FormProps } from './form'

export type StudentFormProps = Omit<FormProps, 'onSubmit'> & {
	defaultValues?: SchoolStudentsMembershipsPutBody
	onSubmit?: (
		e: React.FormEvent<HTMLFormElement>,
		values: SchoolStudentsMembershipsPutBody
	) => void
}

export const StudentForm: React.FC<StudentFormProps> = ({
	defaultValues,
	onSubmit,
	...props
}) => {
	const form = useForm<SchoolStudentsMembershipsPutBody>({
		mode: 'onBlur',
		defaultValues: { memberships: [] },
		resolver: yupResolver(validator.api.schoolStudentsMembershipsPutSchema),
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
			{...props}
			canSubmit={isDirty && isValid}
			onSubmit={handleSubmit}
			error={globalError}
		>
			<Controller
				name='memberships'
				control={form.control}
				render={({ field, fieldState }) => (
					<MultiSelect
						label='Memberships'
						data={[]}
						error={fieldState.error?.message}
						{...field}
						value={field.value?.map((snowflake) => snowflake.toString())}
					/>
				)}
			/>
		</Form>
	)
}

export type RemoteStudentFormProps = FormProps & {
	id: string
}

export const RemoteStudentForm: React.FC<RemoteStudentFormProps> = ({
	id,
	onSubmit,
	...props
}) => {
	const queryKey = ['students', { id }] as const
	const {
		data: student,
		isLoading,
		isError,
		error,
	} = useQuery(queryKey, () => getStudent(id))

	const queryClient = useQueryClient()
	const { mutateAsync } = useMutation(
		queryKey,
		(data: SchoolStudentsMembershipsPutBody) => updateStudentMemberships(id, data),
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
		<StudentForm
			{...props}
			defaultValues={{ memberships: [] }}
			onSubmit={async (e, values) => {
				await mutateAsync(values)
				onSubmit && (await onSubmit(e))
			}}
		/>
	)
}
