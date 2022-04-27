import type { UserPatchBody } from '@common/types'
import { validator } from '@common/util'
import { yupResolver } from '@hookform/resolvers/yup'
import {
	Button,
	Center,
	Group,
	LoadingOverlay,
	Paper,
	PasswordInput,
	TextInput,
	Title,
} from '@mantine/core'
import type React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { getUser, updateUser } from '../data/user'
import getInitials from '../utils/get-initials'
import AvatarInput from './avatar-input'

const AccountForm: React.FC = () => {
	const form = useForm<UserPatchBody>({
		defaultValues: {},
		resolver: yupResolver(validator.api.userPatchSchema),
	})

	const { mutateAsync } = useMutation('me', updateUser)
	const { data, isLoading, error } = useQuery('me', async () => {
		const user = await getUser()
		const { firstName, lastName, avatar } = user
		form.reset({ firstName, lastName, avatar: avatar?.toString() })
		return user
	})

	const { touchedFields } = form.formState
	const handleSubmit = (values: UserPatchBody) => {
		// Create a new object with only the changed values
		const data = Object.fromEntries(
			Object.entries(values).filter(
				([key]) => !!touchedFields[key as keyof UserPatchBody]
			)
		)

		return mutateAsync(data)
	}

	return (
		<Paper shadow='sm' padding='lg' style={{ position: 'relative' }}>
			<LoadingOverlay visible={isLoading} />
			<Title>Account</Title>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<Group direction='column' grow>
					<Center>
						<AvatarInput
							{...form.register('avatar')}
							onChange={(img) => form.setValue('avatar', '')}
						>
							{data && getInitials(data)}
						</AvatarInput>
					</Center>

					<TextInput label='First Name' {...form.register('firstName')} />
					<TextInput label='Last Name' {...form.register('lastName')} />
					<TextInput label='Email' />
					<PasswordInput label='Reset Password' />

					<Group position='right'>
						<Button type='submit'>Save</Button>
					</Group>
				</Group>
			</form>
		</Paper>
	)
}

export default AccountForm
