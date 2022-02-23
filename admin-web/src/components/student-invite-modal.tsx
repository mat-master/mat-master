import { ActionIcon, Button, Group, Modal, TextInput, Title } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import React, { useState } from 'react';
import { X as CloseIcon } from 'react-feather';

export interface StudentInviteFormProps {
	open: boolean;
	onClose: VoidFunction;
}

const StudentInviteForm: React.FC<StudentInviteFormProps> = ({ open, onClose }) => {
	const [email, setEmail] = useState('');
	const [error, setError] = useState<string>();
	const [working, setWorking] = useState(false);
	const notifications = useNotifications();

	const handleClose = () => {
		onClose();
		if (!working) {
			setEmail('');
			setError(undefined);
		}
	};

	const handleSubmit = async () => {
		if (working) return;
		if (!email) return setError('Enter a valid email');
		setError(undefined);
		setWorking(true);

		// TODO: Send api request
		await new Promise((resolve) => setTimeout(resolve, 1000));

		setWorking(false);
		if (open) handleClose();
		notifications.showNotification({
			title: `Invitation sent to ${email}`,
			message: "You'll be notified when they accept the invitation",
			autoClose: 3000,
		});
	};

	return (
		<Modal opened={open} onClose={handleClose} hideCloseButton>
			<Group position='apart' mb='sm'>
				<Title order={3}>Invite A Student</Title>
				<ActionIcon onClick={onClose}>
					<CloseIcon size={18} />
				</ActionIcon>
			</Group>
			<form>
				<Group direction='column' spacing='sm'>
					<TextInput
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder='Email'
						error={error}
						style={{ width: '100%' }}
					/>
					<Group position='right' style={{ width: '100%' }}>
						<Button variant='outline' onClick={handleClose}>
							Cancel
						</Button>
						<Button loading={working} onClick={handleSubmit}>
							Send
						</Button>
					</Group>
				</Group>
			</form>
		</Modal>
	);
};

export default StudentInviteForm;
