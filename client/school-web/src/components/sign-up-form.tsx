import { PasswordInput, TextInput } from '@mantine/core'
import type React from 'react'
import { z } from 'zod'
import { signup } from '../utils/auth'
import type { FormWrapperProps } from './form'
import Form from './form'
import type { RemoteFormWrapperProps } from './remote-form'
import RemoteForm from './remote-form'

export const signUpFormDataSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	email: z.string().email(),
	password: z.string().min(6),
})

export type SignUpFormData = z.infer<typeof signUpFormDataSchema>
export type SignUpFormProps = FormWrapperProps<SignUpFormData>

export const SignUpForm: React.FC<SignUpFormProps> = (props) => (
	<Form<SignUpFormData>
		submitLabel='Sign Up'
		{...props}
		schema={signUpFormDataSchema}
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

export type RemoteSignUpFormProps = RemoteFormWrapperProps<SignUpFormData>

export const RemoteSignUpForm: React.FC<RemoteSignUpFormProps> = (props) => (
	<RemoteForm<SignUpFormData>
		{...props}
		queryKey={['users', { id: 'new' }]}
		createResource={signup}
		child={SignUpForm}
	/>
)
