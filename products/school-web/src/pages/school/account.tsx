import type { UserPatchBody } from '@common/types'
import { validator } from '@common/util'
import { yupResolver } from '@hookform/resolvers/yup'
import {
	Button,
	Center,
	Group,
	LoadingOverlay,
	Paper,
	SimpleGrid,
	TextInput,
	Title,
} from '@mantine/core'
import type React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import AppHeader from '../../components/app-header'
import AvatarInput from '../../components/avatar-input'
import SideBar from '../../components/side-bar'
import { getUser, updateUser } from '../../data/user'
import Page from '../../page'
import getInitials from '../../utils/get-initials'

const AccountPage: React.FC = () => {
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
		<Page authorized header={<AppHeader />} sideBar={<SideBar />}>
			<SimpleGrid cols={2} spacing='sm'>
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

							<Button type='submit'>Save</Button>
						</Group>
					</form>
				</Paper>
				<Paper shadow='sm' padding='lg'>
					<Title>Billing Information</Title>
				</Paper>
			</SimpleGrid>
		</Page>
	)
}

export default AccountPage
