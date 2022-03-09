import type { LoginPostBody } from '@common/types'
import { validator } from '@common/util'
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
import { signin } from '../../data/auth'
import getErrorMessage, { MappedErrors } from '../../utils/get-error-message'
import getInputProps from '../../utils/get-input-props'

const signInErrorSchema: yup.SchemaOf<MappedErrors<LoginPostBody>> = yup.object({
	email: yup.string().notRequired(),
	password: yup.string().notRequired(),
})

const SignInPage: React.FC = ({}) => {
	const navigate = useNavigate()

	const [globalError, setGlobalError] = useState<string>()
	const form = useFormik<LoginPostBody>({
		initialValues: { email: '', password: '' },
		validateOnBlur: false,
		validateOnChange: false,
		validationSchema: validator.loginSchema,
		onSubmit: async (values) => {
			try {
				setGlobalError(undefined)
				await signin(values)
				navigate('/')
			} catch (error) {
				const message = await getErrorMessage<LoginPostBody>(error, signInErrorSchema)
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
							label='Email'
							style={{ width: '36ch' }}
							{...getInputProps(form, 'email')}
						/>
						<PasswordInput label='Password' {...getInputProps(form, 'password')} />
						<Button type='submit' loading={form.isSubmitting}>
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
