import type { User } from '@common/types'
import { yupResolver } from '@hookform/resolvers/yup'
import {
	Avatar,
	Center,
	Group,
	LoadingOverlay,
	TextInput,
	useMantineTheme,
} from '@mantine/core'
import type { ContextModalProps } from '@mantine/modals'
import type React from 'react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import * as yup from 'yup'
import { getUser } from '../data/auth'
import getInitials from '../utils/get-initials'
import ModalActions from './modal-actions'

type UserData = Omit<User, 'id' | 'privilege' | 'avatar'>

const userDataSchema: yup.SchemaOf<Partial<UserData>> = yup.object({
	firstName: yup.string(),
	lastName: yup.string(),
	email: yup.string().email(),
	phone: yup.string(),
})

const UserModal: React.FC<ContextModalProps> = ({ context, id }) => {
	const { data: user, isLoading } = useQuery('me', getUser)
	const mutation = useMutation(async (data: UserData) => console.log(data))
	const form = useForm<UserData>({ resolver: yupResolver(userDataSchema) })
	const theme = useMantineTheme()

	useEffect(() => {
		if (!user) return
		form.setValue('firstName', user.firstName)
		form.setValue('lastName', user.lastName)
		form.setValue('email', user.email)
		form.setValue('phone', user.phone)
	}, [user])

	const handleSubmit = (values: UserData) => {
		mutation.mutate(values)
		context.closeModal(id)
	}

	return (
		<>
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

				<ModalActions primaryLabel='Save' />
			</form>
		</>
	)
}

export default UserModal