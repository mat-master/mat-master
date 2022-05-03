import type { UserPatchBody } from '@common/types'
import { validator } from '@common/util'
import { yupResolver } from '@hookform/resolvers/yup'
import { Center, Loader, Text, TextInput } from '@mantine/core'
import type React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getUser, updateUser } from '../data/user'
import getErrorMessage from '../utils/get-error-message'
import AvatarInput from './avatar-input'
import Form, { FormProps } from './form'

export type UserFormProps = Omit<FormProps, 'onSubmit'> & {
	defaultValues: UserPatchBody
	onSubmit: (e: React.FormEvent<HTMLFormElement>, values: UserPatchBody) => void
}

export const UserForm: React.FC<UserFormProps> = ({
	defaultValues,
	onSubmit,
	...props
}) => {
	const form = useForm<UserPatchBody>({
		resolver: yupResolver(validator.api.userPatchSchema),
		defaultValues: {
			avatar: '',
			firstName: '',
			lastName: '',
			...defaultValues,
		},
	})

	const { isDirty } = form.formState
	const [globalError, setGlobalError] = useState<string>()

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) =>
		form.handleSubmit(async (values) => {
			onSubmit && (await onSubmit(e, values))
		})

	return (
		<Form
			{...props}
			canSubmit={isDirty}
			onSubmit={handleSubmit}
			error={globalError}
		>
			<Center>
				<AvatarInput
					{...form.register('avatar')}
					onChange={(img) => form.setValue('avatar', '')}
				/>
			</Center>

			<TextInput label='First Name' {...form.register('firstName')} />
			<TextInput label='Last Name' {...form.register('lastName')} />
		</Form>
	)
}

export default UserForm

export type RemoteUserFormProps = FormProps & {
	id: string
}

export const RemoteUserForm: React.FC<RemoteUserFormProps> = ({
	id,
	onSubmit,
	...props
}) => {
	const queryKey = ['users', { id }]
	const {
		data: user,
		isLoading,
		isError,
		error,
	} = useQuery(queryKey, () => getUser(id))

	const queryClient = useQueryClient()
	const { mutateAsync } = useMutation(
		queryKey,
		(data: UserPatchBody) => updateUser(data, id),
		{ onSuccess: () => queryClient.invalidateQueries(queryKey) }
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
		<UserForm
			{...props}
			defaultValues={{ firstName: user?.firstName, lastName: user?.lastName }}
			onSubmit={async (e, values) => {
				// Create a new object with only the changed values
				const data = Object.fromEntries(
					Object.entries(values).filter(
						([key, value]) => value !== user![key as keyof UserPatchBody]
					)
				)

				await mutateAsync(data)
				onSubmit && (await onSubmit(e))
			}}
		/>
	)
}
