import { Center, TextInput } from '@mantine/core'
import type React from 'react'
import { getUser, updateUser } from '../data/user'
import AvatarInput from './avatar-input'
import Form, { FormWrapperProps } from './form'
import type { RemoteFormWrapperProps } from './remote-form'
import RemoteForm from './remote-form'

export type UserFormProps = FormWrapperProps<UserPatchBody>

export const UserForm: React.FC<UserFormProps> = (props) => (
	<Form
		{...props}
		schema={validator.api.userPatchSchema}
		child={({ form }) => {
			const { errors } = form.formState

			return (
				<>
					<Center>
						<AvatarInput
							{...form.register('avatar')}
							onChange={(img) => form.setValue('avatar', '')}
						/>
					</Center>

					<TextInput
						label='First Name'
						{...form.register('firstName')}
						error={errors.firstName?.message}
					/>
					<TextInput
						label='Last Name'
						{...form.register('lastName')}
						error={errors.lastName?.message}
					/>
				</>
			)
		}}
	/>
)

export type RemoteUserFormProps = RemoteFormWrapperProps<UserPatchBody> & {
	id: string
}

export const RemoteUserForm: React.FC<RemoteUserFormProps> = ({
	id = 'me',
	...props
}) => (
	<RemoteForm<UserPatchBody>
		{...props}
		queryKey={['users', { id }]}
		getResource={() => getUser(id) as Promise<UserPatchBody>}
		updateResource={(data) => updateUser(id, data)}
		child={UserForm}
	/>
)
