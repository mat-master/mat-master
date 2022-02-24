import { Button, Group, TextInput } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import React, { useRef, useState } from 'react';
import Modal from './modal';

export interface StudentInviteFormProps {
	open: boolean;
	onClose: VoidFunction;
}

const StudentInviteForm: React.FC<StudentInviteFormProps> = ({ open, onClose }) => {
	const emailInputRef = useRef<HTMLInputElement>(null);
	const [error, setError] = useState<string>();
	const notifications = useNotifications();

	const handleSubmit = async () => {
		const email = emailInputRef.current?.value;
		if (!email) return setError('Enter a valid email');
		setError(undefined);
		onClose();

		const notificationId = notifications.showNotification({
			title: 'Sending invitation',
			message: `Sending invitation to ${email}`,
			loading: true,
			autoClose: false,
			disallowClose: true,
		});

		// TODO: Send api request
		await new Promise((resolve) => setTimeout(resolve, 2000));

		notifications.updateNotification(notificationId, {
			id: notificationId,
			title: `Invitation sent`,
			message: 'You will be notified when they accept the invitation',
			loading: false,
		});
	};

	return (
		<Modal opened={open} onClose={onClose} title='Invite a student'>
			<form>
				<Group direction='column' spacing='sm'>
					<TextInput
						ref={emailInputRef}
						placeholder='Email'
						error={error}
						style={{ width: '100%' }}
					/>
					<Group position='right' style={{ width: '100%' }}>
						<Button variant='outline' onClick={onClose}>
							Cancel
						</Button>
						<Button onClick={handleSubmit}>Send</Button>
					</Group>
				</Group>
			</form>
		</Modal>
	);
};

export default StudentInviteForm;
