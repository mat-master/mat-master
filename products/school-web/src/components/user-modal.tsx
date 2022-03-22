import type { UserPatchBody } from '@common/types'
import { validator } from '@common/util'
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
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router'
import { getUser, signout } from '../data/auth'
import getInitials from '../utils/get-initials'
import AvatarInput from './avatar-input'
import ModalActions from './modal-actions'

const UserModal: React.FC<ModalProps> = (props) => {
	const mutation = useMutation(async (data: UserPatchBody) => console.log(data))
	const navigate = useNavigate()

	const form = useForm<UserPatchBody>({
		resolver: yupResolver(validator.api.userPatchSchema),
	})

	const { data: user, isLoading } = useQuery('me', async () => {
		const user = await getUser()
		form.reset({ ...user, avatar: user.avatar?.toString() })
		return user
	})

	const handleClose = () => {
		props.onClose()
		form.clearErrors()
	}

	const handleSubmit = (values: UserPatchBody) => {
		mutation.mutate(values)
		handleClose()
	}

	return (
		<Modal title={<Title order={3}>Account</Title>} {...props} onClose={handleClose}>
			<LoadingOverlay visible={isLoading} />

			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<Group direction='column' grow>
					<Center>
						<AvatarInput
							{...form.register('avatar')}
							onChange={(img) => form.setValue('avatar', '')}
						>
							{user && getInitials(user)}
						</AvatarInput>
					</Center>

					<TextInput label='First Name' {...form.register('firstName')} />
					<TextInput label='Last Name' {...form.register('lastName')} />
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
