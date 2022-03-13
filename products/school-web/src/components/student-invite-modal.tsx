import type { SchoolInvitesPostBody } from '@common/types'
import { validator } from '@common/util'
import { yupResolver } from '@hookform/resolvers/yup'
import { Modal, ModalProps, Text, TextInput, Title } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router'
import { inviteStudent } from '../data/students'
import ModalActions from './modal-actions'

const StudentInviteModal: React.FC<ModalProps> = (props) => {
	const { school } = useParams()
	if (!school) throw Error('Student invite form is designed to be used under a school route')

	const notifications = useNotifications()
	const [globalError, setGlobalError] = useState<string>()
	const form = useForm<SchoolInvitesPostBody>({
		resolver: yupResolver(validator.api.schoolInvitesPostSchema),
	})

	const handleClose = () => {
		props.onClose()
		form.reset()
	}

	const handleSubmit = async (values: SchoolInvitesPostBody) => {
		setGlobalError(undefined)
		handleClose()

		const notificationId = notifications.showNotification({
			title: 'Sending invitation',
			message: `Sending an invitation to ${values.email}`,
			loading: true,
			autoClose: false,
			disallowClose: true,
		})

		await inviteStudent(values, school)

		notifications.updateNotification(notificationId, {
			id: notificationId,
			title: `Invitation sent`,
			message: 'You will be notified when they accept the invitation',
			loading: false,
		})
	}

	return (
		<Modal title={<Title order={3}>Invite A Student</Title>} {...props} onClose={handleClose}>
			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<TextInput
					label='Email'
					style={{ width: '100%' }}
					error={form.formState.errors.email?.message}
					{...form.register('email')}
				/>

				<ModalActions
					primaryLabel='Send'
					secondaryAction={handleClose}
					secondaryLabel='Cancel'
				/>

				{globalError && (
					<Text color='red' align='center'>
						{globalError}
					</Text>
				)}
			</form>
		</Modal>
	)
}

export default StudentInviteModal
