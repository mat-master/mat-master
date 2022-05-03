import type { SchoolInvitesPostBody } from '@common/types'
import { validator } from '@common/util'
import { yupResolver } from '@hookform/resolvers/yup'
import { TextInput } from '@mantine/core'
import type React from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { createInvite } from '../data/invites'
import Form, { FormProps } from './form'

export type InviteFormProps = Omit<FormProps, 'onSubmit'> & {
	defaultValues?: SchoolInvitesPostBody
	onSubmit?: (
		e: React.FormEvent<HTMLFormElement>,
		values: SchoolInvitesPostBody
	) => void
}

const InviteForm: React.FC<InviteFormProps> = ({
	defaultValues,
	onSubmit,
	...props
}) => {
	const form = useForm<SchoolInvitesPostBody>({
		resolver: yupResolver(validator.api.schoolInvitesPostSchema),
	})

	const { isDirty } = form.formState
	const [globalError, setGlobalError] = useState<string>()

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) =>
		form.handleSubmit(async (values) => {
			onSubmit && (await onSubmit(e, values))
		})

	return (
		<Form
			submitLabel='Send'
			canSubmit={isDirty}
			error={globalError}
			{...props}
			onSubmit={handleSubmit}
		>
			<TextInput
				label='Email'
				error={form.formState.errors.email?.message}
				{...form.register('email')}
			/>
		</Form>
	)
}

export type RemoteInviteFormProps = FormProps & {
	id?: string
}

export const RemoteInviteForm: React.FC<RemoteInviteFormProps> = ({
	id,
	onSubmit,
	...props
}) => {
	const queryKey = ['invites', { id }]
	const queryClient = useQueryClient()
	const { mutateAsync } = useMutation(
		queryKey,
		(data: SchoolInvitesPostBody) => {
			if (!id) return createInvite(data)
			throw 'Unimplemented'
		},
		{ onSuccess: () => queryClient.invalidateQueries(queryKey) }
	)

	return (
		<InviteForm
			{...props}
			onSubmit={async (e, values) => {
				await mutateAsync(values)
				onSubmit && (await onSubmit(e))
			}}
		/>
	)
}
