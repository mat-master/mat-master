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
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { signup, SignUpData } from '../../data/auth'
import getErrorMessage from '../../utils/get-error-message'
import getInputProps from '../../utils/get-input-props'

type SignUpErrors = { [_ in keyof SignUpData]?: string | undefined }

const signUpSchema: yup.SchemaOf<SignUpData> = yup.object({
	firstName: yup.string().required('Required'),
	lastName: yup.string().required('Required'),
	email: yup.string().email('Invalid email').required('Required'),
	password: yup.string().min(6, 'Minimum of 6 characters').required('Required'),
})

const signUpErrorSchema: yup.SchemaOf<SignUpErrors> = yup.object({
	firstName: yup.string(),
	lastName: yup.string(),
	email: yup.string(),
	password: yup.string(),
})

const SignUpPage: React.FC = ({}) => {
	const navigate = useNavigate()

	const [globalError, setGlobalError] = useState<string>()
	const form = useFormik<SignUpData>({
		initialValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
		},
		validateOnBlur: false,
		validateOnChange: false,
		validationSchema: signUpSchema,
		onSubmit: async (values) => {
			try {
				await signup(values)
				navigate('/')
			} catch (error) {
				const message = await getErrorMessage<SignUpErrors>(error, signUpErrorSchema)
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
						<Title order={2}>Sign up</Title>

						<TextInput
							label='First Name'
							style={{ width: '36ch' }}
							{...getInputProps(form, 'firstName')}
						/>
						<TextInput label='Last Name' {...getInputProps(form, 'lastName')} />
						<TextInput autoComplete='email' label='Email' {...getInputProps(form, 'email')} />
						<PasswordInput label='Password' {...getInputProps(form, 'password')} />

						<Button type='submit' loading={form.isSubmitting}>
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
