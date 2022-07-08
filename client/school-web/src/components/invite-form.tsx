import { TextInput } from '@mantine/core'
import type React from 'react'
import { z } from 'zod'
import { trpcClient } from '..'
import getSchoolId from '../utils/get-school-id'
import Form, { FormWrapperProps } from './form'
import type { RemoteFormWrapperProps } from './remote-form'
import RemoteForm from './remote-form'

export const inviteFormDataSchema = z.object({
	email: z.string().email(),
})

export type InviteFormData = z.infer<typeof inviteFormDataSchema>
export type InviteFormProps = FormWrapperProps<InviteFormData>

export const InviteForm: React.FC<InviteFormProps> = (props) => (
	<Form<InviteFormData>
		{...props}
		schema={inviteFormDataSchema}
		child={({ form }) => {
			const { errors } = form.formState

			return (
				<TextInput
					label='Email'
					error={errors.email?.message}
					{...form.register('email')}
				/>
			)
		}}
	/>
)

export type RemoteInviteFormProps = RemoteFormWrapperProps<InviteFormData>

export const RemoteInviteForm: React.FC<RemoteInviteFormProps> = (props) => {
	const schoolId = getSchoolId()!
	return (
		<RemoteForm<InviteFormData>
			submitLabel='Send'
			{...props}
			queryKey={['invites', {}]}
			createResource={({ email }) =>
				trpcClient.mutation('school.invites.create', { schoolId, email })
			}
			child={InviteForm}
		/>
	)
}
