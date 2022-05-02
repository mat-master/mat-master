import type { SchoolInvitesPostBody } from '@common/types'
import { validator } from '@common/util'
import { yupResolver } from '@hookform/resolvers/yup'
import { TextInput } from '@mantine/core'
import type React from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { createInvite } from '../data/invites'
import Form, { FormProps } from './form'

const StudentInviteForm: React.FC<FormProps> = ({ onSubmit, ...props }) => {
	const form = useForm<SchoolInvitesPostBody>({
		resolver: yupResolver(validator.api.schoolInvitesPostSchema),
	})

	const queryKey = 'invites'
	const queryClient = useQueryClient()
	const { mutateAsync } = useMutation(queryKey, createInvite, {
		onSuccess: () => queryClient.invalidateQueries(queryKey),
	})

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) =>
		form.handleSubmit(async (values) => {
			await mutateAsync(values)
			onSubmit && (await onSubmit(e))
		})(e)

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
