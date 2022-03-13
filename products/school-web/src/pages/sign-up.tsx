import type { SignupPostBody } from '@common/types'
import { validator } from '@common/util'
import { yupResolver } from '@hookform/resolvers/yup'
import {
	Anchor,
	Button,
	Center,
	Group,
	Paper,
	PasswordInput,
	Text,
	TextInput,
	Title,
} from '@mantine/core'
import { useLocalStorageValue } from '@mantine/hooks'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { signin, signup } from '../data/auth'
import getErrorMessage from '../utils/get-error-message'

const SignUpPage: React.FC = () => {
	const [jwt] = useLocalStorageValue({ key: 'jwt' })
	const navigate = useNavigate()
	const redirect = '/schools'

	useEffect(() => {
		if (jwt) navigate(redirect)
	}, [])

	const [globalError, setGlobalError] = useState<string>()
	const form = useForm<SignupPostBody>({
		resolver: yupResolver(validator.api.signupPostSchema),
	})

	const handleSubmit = async (values: SignupPostBody) => {
		try {
			setGlobalError(undefined)
			await signup(values)
			await signin({ email: values.email, password: values.password })
			navigate(redirect)
		} catch (error) {
			const message = getErrorMessage(error, validator.api.signupPostSchema)
			typeof message === 'string' && setGlobalError(message)
		}
	}

	return (
		<Center style={{ flexDirection: 'column' }}>
			<Paper padding='lg' mt='xl' mb='sm' shadow='sm' withBorder>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<Group direction='column' spacing='sm' grow>
						<Title order={2}>Sign up</Title>

						<TextInput
							label='First Name'
							error={form.formState.errors.firstName?.message}
							style={{ width: '36ch' }}
							{...form.register('firstName')}
						/>
						<TextInput
							label='Last Name'
							error={form.formState.errors.lastName?.message}
							{...form.register('lastName')}
						/>
						<TextInput
							label='Email'
							error={form.formState.errors.email?.message}
							{...form.register('email')}
						/>
						<PasswordInput
							label='Password'
							error={form.formState.errors.password?.message}
							{...form.register('password')}
						/>
						<Button type='submit' loading={form.formState.isSubmitting}>
							Sign Up
						</Button>

						{globalError && (
							<Text color='red' align='center'>
								{globalError}
							</Text>
						)}
					</Group>
				</form>
			</Paper>

			<Text color='dimmed'>
				Already have an account?{' '}
				<Anchor component={Link} to='../sign-in'>
					Sign in
				</Anchor>
			</Text>
		</Center>
	)
}

export default SignUpPage
