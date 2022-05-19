import type { LoginPostBody } from '@common/types'
import { validator } from '@common/util'
import { PasswordInput, TextInput } from '@mantine/core'
import type React from 'react'
import { signin } from '../data/auth'
import type { FormWrapperProps } from './form'
import Form from './form'
import type { RemoteFormWrapperProps } from './remote-form'
import RemoteForm from './remote-form'

export type SignInFormProps = FormWrapperProps<LoginPostBody>

export const SignInForm: React.FC<SignInFormProps> = (props) => (
	<Form
		submitLabel='Sign in'
		{...props}
		schema={validator.api.loginPostSchema}
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

export type RemoteSignInFormProps = RemoteFormWrapperProps<LoginPostBody>

export const RemoteSignInForm: React.FC<RemoteSignInFormProps> = (props) => (
	<RemoteForm<LoginPostBody>
		{...props}
		queryKey={['users', { id: 'me' }]}
		createResource={signin}
		child={SignInForm}
	/>
)
