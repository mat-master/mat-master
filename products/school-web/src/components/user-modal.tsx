import type { User } from '@common/types'
import { yupResolver } from '@hookform/resolvers/yup'
import {
	Avatar,
	Center,
	Group,
	LoadingOverlay,
	Modal,
	ModalProps,
	TextInput,
	Title,
	useMantineTheme,
} from '@mantine/core'
import type React from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router'
import * as yup from 'yup'
import { getUser, signout } from '../data/auth'
import getInitials from '../utils/get-initials'
import ModalActions from './modal-actions'

type UserData = Omit<User, 'id' | 'privilege'>

const userDataSchema: yup.SchemaOf<Partial<UserData>> = yup.object({
	firstName: yup.string(),
	lastName: yup.string(),
	email: yup.string().email(),
	phone: yup.string(),
	avatar: yup.string(),
})

const UserModal: React.FC<ModalProps> = (props) => {
	const { data: user, isLoading } = useQuery('me', getUser)
	const mutation = useMutation(async (data: UserData) => console.log(data))
	const form = useForm<UserData>({ resolver: yupResolver(userDataSchema) })
	const navigate = useNavigate()
	const theme = useMantineTheme()

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
						<Avatar size='xl' radius={128} color={theme.primaryColor}>
							{user && getInitials(user)}
						</Avatar>
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
