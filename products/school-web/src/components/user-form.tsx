import type { User, UserPatchBody } from '@common/types'
import { validator } from '@common/util'
import { yupResolver } from '@hookform/resolvers/yup'
import { Center, TextInput } from '@mantine/core'
import type React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getUser, updateUser } from '../data/user'
import getInitials from '../utils/get-initials'
import AvatarInput from './avatar-input'
import Form, { FormProps } from './form'

export type UserFormProps = FormProps & {
	id?: string
}

const UserForm: React.FC<UserFormProps> = ({ id = 'me', onSubmit, ...props }) => {
	const form = useForm<UserPatchBody>({
		defaultValues: {},
		resolver: yupResolver(validator.api.userPatchSchema),
	})

	const queryKey = ['users', { id }]
	const { data: user } = useQuery<User, null, User>(queryKey, () => getUser(id), {
		onSuccess: ({ firstName, lastName }) => {
			form.reset({ firstName, lastName })
		},
	})

	const queryClient = useQueryClient()
	const { mutateAsync } = useMutation(
		queryKey,
		(data: UserPatchBody) => updateUser(data, id),
		{
			onSuccess: () => queryClient.invalidateQueries(queryKey),
		}
	)

	const { isDirty, touchedFields } = form.formState
	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) =>
		form.handleSubmit(async (values) => {
			// Create a new object with only the changed values
			const data = Object.fromEntries(
				Object.entries(values).filter(
					([key]) => !!touchedFields[key as keyof UserPatchBody]
				)
			)

			await mutateAsync(data)
			onSubmit && (await onSubmit(e))
		})(e)

	return (
		<Form {...props} onSubmit={handleSubmit} canSubmit={isDirty}>
			<Center>
				<AvatarInput
					{...form.register('avatar')}
					onChange={(img) => form.setValue('avatar', '')}
				>
					{user && getInitials(user)}
				</AvatarInput>
			</Center>

			<TextInput label='First Name' {...form.register('firstName')} />
			<TextInput label='Last Name' {...form.register('lastName')} />
			<TextInput label='Email' value={user?.email || ''} disabled />
		</Form>
	)
}

export default UserForm
