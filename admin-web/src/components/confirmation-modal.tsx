import { Button, Group } from '@mantine/core';
import { useNotifications } from '@mantine/notifications';
import React from 'react';
import Modal from './modal';

export interface ConfirmationModalProps {
	open: boolean;
	onClose: VoidFunction;
	resourceType: string;
	actionType?: string | undefined;
	action: () => void | Promise<void>;
	successMessage: string;
	workingMessage: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
	open,
	onClose,
	resourceType,
	actionType = 'delete',
	action,
	successMessage,
	workingMessage,
}) => {
	const notifications = useNotifications();

	const handleConfirmation = async () => {
		onClose();

		const notificationId = notifications.showNotification({
			message: workingMessage,
			loading: true,
			autoClose: false,
			disallowClose: true,
		});

		await action();

		notifications.updateNotification(notificationId, {
			id: notificationId,
			message: successMessage,
			loading: false,
		});
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
				<Button onClick={handleConfirmation}>
					Yes, {actionType} this {resourceType}
				</Button>
			</Group>
		</Modal>
	);
};

export default ConfirmationModal;
