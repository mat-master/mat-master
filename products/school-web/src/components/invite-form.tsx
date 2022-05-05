import type { SchoolInvitesPostBody } from '@common/types'
import { validator } from '@common/util'
import { TextInput } from '@mantine/core'
import type React from 'react'
import { createInvite, getInvite } from '../data/invites'
import Form, { FormWrapperProps } from './form'
import type { RemoteFormWrapperProps } from './remote-form'
import RemoteForm from './remote-form'

export type InviteFormProps = FormWrapperProps<SchoolInvitesPostBody>

const InviteForm: React.FC<InviteFormProps> = (props) => (
	<Form<SchoolInvitesPostBody>
		{...props}
		schema={validator.api.schoolInvitesPostSchema}
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

export type RemoteInviteFormProps =
	RemoteFormWrapperProps<SchoolInvitesPostBody> & {
		id?: string
	}

export const RemoteInviteForm: React.FC<RemoteInviteFormProps> = ({
	id = 'new',
	...props
}) => (
	<RemoteForm<SchoolInvitesPostBody>
		{...props}
		queryKey={['invites', { id }]}
		getResource={id ? () => getInvite(id) : undefined}
		createResource={id ? undefined : createInvite}
		updateResource={id ? () => {} : undefined}
		child={InviteForm}
	/>
)
