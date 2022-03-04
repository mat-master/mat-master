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
import { useFormik } from 'formik'
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { authContext, SignInData } from '../../data/auth-provider'
import getErrorMessage from '../../utils/get-error-message'
import getInputProps from '../../utils/get-input-props'

type SignInErrors = { [_ in keyof SignInData]?: string | undefined }

const signInSchema: yup.SchemaOf<SignInData> = yup.object({
	email: yup.string().email('Invalid email').required('Required'),
	password: yup.string().min(6, 'Minimum of 6 characters').required('Required'),
})

const signInErrorSchema: yup.SchemaOf<SignInErrors> = yup.object({
	email: yup.string().notRequired(),
	password: yup.string().notRequired(),
})

const SignInPage: React.FC = ({}) => {
	const auth = useContext(authContext)
	const navigate = useNavigate()

	const [globalError, setGlobalError] = useState<string>()
	const form = useFormik<SignInData>({
		initialValues: {
			email: '',
			password: '',
		},
		validateOnBlur: false,
		validateOnChange: false,
		validationSchema: signInSchema,
		onSubmit: async (values) => {
			try {
				await auth.signin(values)
				navigate('/')
			} catch (error) {
				const message = await getErrorMessage<SignInErrors>(error, signInErrorSchema)
				if (typeof message === 'string') {
					setGlobalError(message)
				} else {
					form.setErrors(message)
				}
			}
		},
	})

	return (
		<Center style={{ flexDirection: 'column' }}>
			<Paper padding='lg' mt='xl' mb='sm' shadow='sm' withBorder>
				<form onSubmit={form.handleSubmit}>
					<Group direction='column' spacing='sm' grow>
						<Title order={2}>Sign in</Title>

						<TextInput
							type='email'
							label='Email'
							style={{ width: '36ch' }}
							{...getInputProps(form, 'email')}
						/>
						<PasswordInput label='Password' {...getInputProps(form, 'password')} />
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
