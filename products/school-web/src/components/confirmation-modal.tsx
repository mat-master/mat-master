import type React from 'react';
import useAsyncAction, { ActionType } from '../hooks/use-async-action';
import Modal from './modal';
import ModalActions from './modal-actions';

export interface ConfirmationModalProps {
	onClose: VoidFunction;
	resourceLabel: string;
	actionType: ActionType;
	action: () => void | Promise<void>;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
	onClose,
	resourceLabel,
	actionType,
	action,
}) => {
	const onConfirmation = async () => {
		onClose();
		await action();
	};

	const handleConfirmation = useAsyncAction(onConfirmation, actionType, resourceLabel);

	return (
		<Modal
			title={`Are you sure you want to ${actionType} ${resourceLabel}?`}
			onClose={onClose}
			opened
		>
			<ModalActions
				primaryAction={handleConfirmation}
				primaryLabel={`Yes, ${actionType} ${resourceLabel}`}
				secondaryAction={onClose}
				secondaryLabel='Cancel'
			/>
		</Modal>
	);
};

export default ConfirmationModal;
