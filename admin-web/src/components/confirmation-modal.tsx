import { Button, Group } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import React, { useState } from 'react';
import Modal from './modal';

export interface ConfirmationModalProps {
	open: boolean;
	onClose: VoidFunction;
	resourceType: string;
	actionType?: string | undefined;
	action: () => void | Promise<void>;
	successMessage?: string | undefined;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
	open,
	onClose,
	resourceType,
	actionType = 'delete',
	action,
	successMessage,
}) => {
	const [working, setWorking] = useState(false);
	const notifications = useNotifications();

	const handleClose = () => {
		onClose();
	};

	const handleConfirmation = async () => {
		if (working) return;
		setWorking(true);
		await action();

		handleClose();
		setWorking(false);
		successMessage && notifications.showNotification({ message: successMessage });
	};

	return (
		<Modal
			opened={open}
			onClose={onClose}
			title={`Are you sure you want to ${actionType} this ${resourceType}?`}
		>
			<Group style={{ width: '100%' }} position='right'>
				<Button variant='outline' onClick={onClose}>
					Cancel
				</Button>
				<Button onClick={handleConfirmation} loading={working}>
					Yes, {actionType} this {resourceType}
				</Button>
			</Group>
		</Modal>
	);
};

export default ConfirmationModal;
