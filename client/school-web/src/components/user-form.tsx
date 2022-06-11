import { Center, TextInput } from '@mantine/core'
import type React from 'react'
import { z } from 'zod'
import { trpcClient } from '..'
import AvatarInput from './avatar-input'
import Form, { FormWrapperProps } from './form'
import type { RemoteFormWrapperProps } from './remote-form'
import RemoteForm from './remote-form'

export const userFormDataSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
})

export type UserFormData = z.infer<typeof userFormDataSchema>
export type UserFormProps = FormWrapperProps<UserFormData>

export const UserForm: React.FC<UserFormProps> = (props) => (
	<Form
		{...props}
		schema={userFormDataSchema}
		child={({ form }) => {
			const { errors } = form.formState

			return (
				<>
					<Center>
						<AvatarInput
							// {...form.register('avatar')}
							onChange={(img) => {}}
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

export type RemoteUserFormProps = RemoteFormWrapperProps<UserFormData>

export const RemoteUserForm: React.FC<RemoteUserFormProps> = (props) => (
	<RemoteForm<UserFormData>
		{...props}
		queryKey={['me', {}]}
		getResource={() => trpcClient.query('me.get')}
		updateResource={(data) =>
			trpcClient.mutation('me.update', {
				firstName: data.firstName,
				lastName: data.lastName,
			})
		}
		child={UserForm}
	/>
)
