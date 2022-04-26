import type { User, UserPatchBody } from '@common/types'
import { validator } from '@common/util'
import { yupResolver } from '@hookform/resolvers/yup'
import {
	Center,
	Group,
	LoadingOverlay,
	Modal,
	ModalProps,
	SimpleGrid,
	TextInput,
	Title,
} from '@mantine/core'
import type React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { getUser, updateUser } from '../data/user'
import getInitials from '../utils/get-initials'
import AvatarInput from './avatar-input'
import ModalActions from './modal-actions'

const userToFormValues = (user?: User) => {
	if (!user) return {}
	const { firstName, lastName, avatar } = user
	return { firstName, lastName, avatar: avatar?.toString() }
}

const UserModal: React.FC<ModalProps> = (props) => {
	const { mutateAsync } = useMutation('me', updateUser)
	const { data, isLoading, error } = useQuery('me', async () => {
		const user = await getUser()
		form.reset(userToFormValues(user))
		return user
	})

	const form = useForm<UserPatchBody>({
		defaultValues: userToFormValues(data),
		resolver: yupResolver(validator.api.userPatchSchema),
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
		<Modal title={<Title order={3}>Account</Title>} size='xl' {...props}>
			<LoadingOverlay visible={isLoading} />

			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<SimpleGrid cols={2}>
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
					</Group>
				</SimpleGrid>

				<ModalActions primaryLabel='Save' />
			</form>
		</Modal>
	)
}

export default UserModal
