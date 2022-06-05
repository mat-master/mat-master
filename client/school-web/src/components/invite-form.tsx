import { TextInput } from '@mantine/core'
import { createSchoolInviteParamsSchema } from '@mat-master/api'
import type React from 'react'
import { useContext } from 'react'
import { z } from 'zod'
import { trpcClient } from '..'
import { schoolContext } from '../data/school-provider'
import Form, { FormWrapperProps } from './form'
import type { RemoteFormWrapperProps } from './remote-form'
import RemoteForm from './remote-form'

export const inviteFormDataSchema = createSchoolInviteParamsSchema.omit({
	schoolId: true,
})

export type InviteFormData = z.infer<typeof inviteFormDataSchema>
export type InviteFormProps = FormWrapperProps<InviteFormData>

const InviteForm: React.FC<InviteFormProps> = (props) => (
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
	const { id: schoolId } = useContext(schoolContext)
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
