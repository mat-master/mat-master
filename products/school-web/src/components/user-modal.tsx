import type { Snowflake } from '@common/types'
import { yupResolver } from '@hookform/resolvers/yup'
import {
	Center,
	Group,
	LoadingOverlay,
	Modal,
	ModalProps,
	TextInput,
	Title,
} from '@mantine/core'
import type React from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router'
import * as yup from 'yup'
import { getUser, signout } from '../data/auth'
import getInitials from '../utils/get-initials'
import AvatarInput from './avatar-input'
import ModalActions from './modal-actions'

interface UserData {
	firstName: string
	lastName: string
	email: string
	avatar: File | Snowflake
}

const userDataSchema: yup.SchemaOf<UserData> = yup.object({
	firstName: yup.string().required(),
	lastName: yup.string().required(),
	email: yup.string().email().required(),
	avatar: yup.mixed<File | Snowflake>().required(),
})

const UserModal: React.FC<ModalProps> = (props) => {
	const { data: user, isLoading } = useQuery('me', getUser)
	const mutation = useMutation(async (data: UserData) => console.log(data))
	const navigate = useNavigate()

	const form = useForm<UserData>({
		defaultValues: { avatar: undefined },
		resolver: yupResolver(userDataSchema),
	})

	useEffect(() => {
		user && form.reset(user)
	}, [user])

	const handleSubmit = (values: UserData) => {
		mutation.mutate(values)
		props.onClose()
	}

	return (
		<Modal title={<Title order={3}>Account</Title>} {...props}>
			<LoadingOverlay visible={isLoading} />

			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<Group direction='column' grow>
					<Center>
						<AvatarInput onChange={(img) => form.setValue('avatar', img)}>
							{user && getInitials(user)}
						</AvatarInput>
					</Center>

					<TextInput label='First Name' {...form.register('firstName')} />
					<TextInput label='Last Name' {...form.register('lastName')} />
					<TextInput label='Email' {...form.register('email')} />
				</Group>

				<ModalActions
					primaryLabel='Save'
					secondaryAction={() => signout(navigate)}
					secondaryLabel='Sign Out'
				/>
			</form>
		</Modal>
	)
}

export default UserModal
