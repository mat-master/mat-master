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
import { useForm } from '@mantine/hooks'
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authContext } from '../../data/auth-provider'
import getErrorMessage from '../../utils/get-error-message'
import validateEmail from '../../utils/validate-email'

interface Credential {
	email: string
	password: string
}

const SignInPage: React.FC = ({}) => {
	const auth = useContext(authContext)
	const navigate = useNavigate()

	const [working, setWorking] = useState(false)
	const [globalError, setGlobalError] = useState('')
	const form = useForm<Credential>({
		initialValues: { email: '', password: '' },
		validationRules: { email: validateEmail },
		errorMessages: { email: 'Invalid email address' },
	})

	const handleSubmit = async (value: Credential) => {
		try {
			if (working) return
			setWorking(true)

			setGlobalError('')
			await auth.signin(value.email, value.password)
			navigate('/')
		} catch (error) {
			setGlobalError(getErrorMessage(error))
		}
	}

	return (
		<Center style={{ flexDirection: 'column' }}>
			<Paper padding='lg' mt='xl' mb='sm' shadow='sm' withBorder>
				<form onSubmit={form.onSubmit(handleSubmit)}>
					<Group direction='column' spacing='sm' grow>
						<Title order={2}>Sign in</Title>
						<TextInput
							type='email'
							label='Email'
							style={{ width: '36ch' }}
							{...form.getInputProps('email')}
						/>
						<PasswordInput label='Password' {...form.getInputProps('password')} />
						<Button type='submit'>Sign In</Button>
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
