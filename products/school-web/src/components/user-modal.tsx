import type { User } from '@common/types'
import { yupResolver } from '@hookform/resolvers/yup'
import {
	ActionIcon,
	Avatar,
	Center,
	Group,
	LoadingOverlay,
	Modal,
	TextInput,
	useMantineTheme,
} from '@mantine/core'
import type React from 'react'
import { useEffect } from 'react'
import { X as CloseIcon } from 'react-feather'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import * as yup from 'yup'
import { getUser } from '../data/auth'
import ModalActions from './modal-actions'

export interface AccountModalProps {
	open: boolean
	onClose: VoidFunction
}

type UserData = Omit<User, 'id' | 'privilege' | 'avatar'>

const userDataSchema: yup.SchemaOf<Partial<UserData>> = yup.object({
	firstName: yup.string(),
	lastName: yup.string(),
	email: yup.string().email(),
	phone: yup.string(),
})

const UserModal: React.FC<AccountModalProps> = ({ open, onClose }) => {
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

	return (
		<Modal opened={open} onClose={onClose} hideCloseButton>
			<LoadingOverlay visible={isLoading} />

			<ActionIcon
				onClick={onClose}
				sx={{
					position: 'absolute',
					top: theme.spacing.md,
					right: theme.spacing.md,
				}}
			>
				<CloseIcon size={18} />
			</ActionIcon>

			<form onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
				<Group direction='column' grow>
					<Center>
						<Avatar size='xl' radius={128} color={theme.primaryColor}>
							BB
						</Avatar>
					</Center>

					<TextInput label='First Name' {...form.register('firstName')} />
					<TextInput label='Last Name' {...form.register('lastName')} />
					<TextInput label='Email' {...form.register('email')} />
				</Group>

				<ModalActions primaryLabel='Save' />
			</form>
		</Modal>
	)
}

export default UserModal
