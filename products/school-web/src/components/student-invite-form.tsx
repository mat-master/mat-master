import type { SchoolInvitesPostBody } from '@common/types'
import { validator } from '@common/util'
import { yupResolver } from '@hookform/resolvers/yup'
import { TextInput } from '@mantine/core'
import type React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { createInvitation } from '../data/invitations'
import Form, { FormProps } from './form'

const StudentInviteForm: React.FC<FormProps> = ({ onSubmit, ...props }) => {
	const form = useForm<SchoolInvitesPostBody>({
		resolver: yupResolver(validator.api.schoolInvitesPostSchema),
	})

	const { mutateAsync } = useMutation('invitations', createInvitation)
	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
		await form.handleSubmit((values) => mutateAsync(values))(e)
		onSubmit && (await onSubmit(e))
	}

	return (
		<Form submitLabel='Send' {...props} onSubmit={handleSubmit}>
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
