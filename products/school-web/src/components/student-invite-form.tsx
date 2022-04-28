import type { SchoolInvitesPostBody } from '@common/types'
import { validator } from '@common/util'
import { yupResolver } from '@hookform/resolvers/yup'
import { TextInput } from '@mantine/core'
import type React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import Form from './form'

const StudentInviteForm: React.FC = () => {
	const form = useForm<SchoolInvitesPostBody>({
		resolver: yupResolver(validator.api.schoolInvitesPostSchema),
	})

	const { mutateAsync } = useMutation(
		'invitations',
		(values: SchoolInvitesPostBody) => {
			throw 'Unimplemented'
		}
	)

	return (
		<Form onSubmit={form.handleSubmit((values) => mutateAsync(values))}>
			<TextInput
				label='Email'
				style={{ width: '100%' }}
				error={form.formState.errors.email?.message}
				{...form.register('email')}
			/>
		</Form>
	)
}

export default StudentInviteForm
