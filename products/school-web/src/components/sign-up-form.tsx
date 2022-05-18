import type { SignupPostBody } from '@common/types'
import { validator } from '@common/util'
import { PasswordInput, TextInput } from '@mantine/core'
import type React from 'react'
import { signup } from '../data/auth'
import type { FormWrapperProps } from './form'
import Form from './form'
import type { RemoteFormWrapperProps } from './remote-form'
import RemoteForm from './remote-form'

export type SignUpFormProps = FormWrapperProps<SignupPostBody>

export const SignUpForm: React.FC<SignUpFormProps> = (props) => (
	<Form
		submitLabel='Sign Up'
		{...props}
		schema={validator.api.signupPostSchema}
		child={({ form }) => {
			const { errors } = form.formState

			return (
				<>
					<TextInput
						label='First Name'
						error={errors.firstName?.message}
						{...form.register('firstName')}
					/>
					<TextInput
						label='Last Name'
						error={errors.lastName?.message}
						{...form.register('lastName')}
					/>
					<TextInput
						label='Email'
						error={errors.email?.message}
						{...form.register('email')}
					/>
					<PasswordInput
						label='Password'
						error={form.formState.errors.password?.message}
						{...form.register('password')}
					/>
				</>
			)
		}}
	/>
)

export type RemoteSignUpFormProps = RemoteFormWrapperProps<SignupPostBody>

export const RemoteSignUpForm: React.FC<RemoteSignUpFormProps> = (props) => (
	<RemoteForm<SignupPostBody>
		{...props}
		queryKey={['users', { id: 'new' }]}
		createResource={signup}
		child={SignUpForm}
	/>
)
