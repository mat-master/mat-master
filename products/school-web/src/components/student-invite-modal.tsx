import { TextInput } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import React, { useRef, useState } from 'react';
import validateEmail from '../utils/validate-email'
import Modal from './modal'
import ModalActions from './modal-actions'

export interface StudentInviteFormProps {
	open: boolean
	onClose: VoidFunction
}

const StudentInviteForm: React.FC<StudentInviteFormProps> = ({ open, onClose }) => {
	const emailInputRef = useRef<HTMLInputElement>(null)
	const [error, setError] = useState<string>()
	const notifications = useNotifications()

	const handleSubmit = async () => {
		const email = emailInputRef.current?.value
		if (!validateEmail(email)) return setError('Enter a valid email')
		setError(undefined)
		onClose()

		const notificationId = notifications.showNotification({
			title: 'Sending invitation',
			message: `Sending invitation to ${email}`,
			loading: true,
			autoClose: false,
			disallowClose: true,
		})

		// TODO: Send api request
		await new Promise((resolve) => setTimeout(resolve, 2000))

		notifications.updateNotification(notificationId, {
			id: notificationId,
			title: `Invitation sent`,
			message: 'You will be notified when they accept the invitation',
			loading: false,
		})
	}

	return (
		<Modal opened={open} onClose={onClose} title='Invite A Student'>
			<TextInput
				type='email'
				placeholder='Email'
				ref={emailInputRef}
				error={error}
				style={{ width: '100%' }}
			/>

			<ModalActions
				primaryAction={handleSubmit}
				primaryLabel='Send'
				secondaryAction={onClose}
				secondaryLabel='Cancel'
			/>
		</Modal>
	)
}

export default StudentInviteForm;
