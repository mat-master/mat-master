import { Modal, Title } from '@mantine/core'
import type React from 'react'
import ModalActions from './modal-actions'

export interface ConfirmationModalProps {
	onClose: VoidFunction
	resourceLabel: string
	action: () => void | Promise<void>
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
	onClose,
	resourceLabel,
	action,
}) => {
	const onConfirmation = async () => {
		onClose()
		await action()
	}

	return (
		<Modal
			title={
				<Title order={3}>{`Are you sure you want to ${actionType} ${resourceLabel}?`}</Title>
			}
			onClose={onClose}
			opened
		>
			<ModalActions
				primaryLabel={`Yes, ${actionType} ${resourceLabel}`}
				secondaryAction={onClose}
				secondaryLabel='Cancel'
			/>
		</Modal>
	)
}

export default ConfirmationModal
