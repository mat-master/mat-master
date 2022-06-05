import { PasswordInput, TextInput } from '@mantine/core'
import { authLoginParamsSchema } from '@mat-master/api'
import type React from 'react'
import { z } from 'zod'
import { signin } from '../utils/auth'
import type { FormWrapperProps } from './form'
import Form from './form'
import type { RemoteFormWrapperProps } from './remote-form'
import RemoteForm from './remote-form'

export const signInFormDataSchema = authLoginParamsSchema

export type SignInFormData = z.infer<typeof signInFormDataSchema>
export type SignInFormProps = FormWrapperProps<SignInFormData>

export const SignInForm: React.FC<SignInFormProps> = (props) => (
	<Form<SignInFormData>
		submitLabel='Sign in'
		{...props}
		schema={signInFormDataSchema}
		child={({ form }) => {
			const { errors } = form.formState

			return (
				<>
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

export type RemoteSignInFormProps = RemoteFormWrapperProps<SignInFormData>

export const RemoteSignInForm: React.FC<RemoteSignInFormProps> = (props) => (
	<RemoteForm<SignInFormData>
		{...props}
		queryKey={['users', { id: 'me' }]}
		createResource={signin}
		child={SignInForm}
	/>
)
