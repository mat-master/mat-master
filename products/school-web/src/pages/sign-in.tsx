import type { LoginPostBody } from '@common/types'
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
import { signin } from '../data/auth'
import getErrorMessage from '../utils/get-error-message'

const SignInPage: React.FC = () => {
	const [jwt] = useLocalStorageValue({ key: 'jwt' })
	const navigate = useNavigate()
	const redirect = '/schools'

	useEffect(() => {
		if (jwt) navigate(redirect)
	}, [])

	const [globalError, setGlobalError] = useState<string>()
	const form = useForm<LoginPostBody>({ resolver: yupResolver(validator.api.loginPostSchema) })
	const handleSubmit = async (values: LoginPostBody) => {
		try {
			setGlobalError(undefined)
			await signin(values)
			navigate(redirect)
		} catch (error) {
			const message = getErrorMessage(error, validator.api.loginPostSchema)
			typeof message === 'string' && setGlobalError(message)
		}
	}

	return (
		<Center style={{ flexDirection: 'column' }}>
			<Paper padding='lg' mt='xl' mb='sm' shadow='sm' withBorder>
				<form onSubmit={form.handleSubmit(handleSubmit)}>
					<Group direction='column' spacing='sm' grow>
						<Title order={2}>Sign in</Title>

						<TextInput
							label='Email'
							error={form.formState.errors.email?.message}
							style={{ width: '36ch' }}
							{...form.register('email')}
						/>
						<PasswordInput
							label='Password'
							error={form.formState.errors.password?.message}
							{...form.register('password')}
						/>
						<Button type='submit' loading={form.formState.isSubmitting}>
							Sign In
						</Button>

						{globalError && (
							<Text align='center' color='red'>
								{globalError}
							</Text>
						)}
					</Group>
				</form>
			</Paper>

			<Text color='dimmed'>
				Don't have an account?{' '}
				<Anchor component={Link} to='../sign-up'>
					Sign up
				</Anchor>
			</Text>
		</Center>
	)
}

export default SignInPage
