import { Modal, Title } from '@mantine/core'
import type React from 'react'
import ModalActions from './modal-actions'

export interface ConfirmationModalProps {
	open: boolean
	onClose: VoidFunction
	actionType: string
	resourceLabel: string
	action: () => void | Promise<void>
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
	open,
	onClose,
	actionType = '',
	resourceLabel = '',
	action,
}) => {
	return (
		<Modal
			opened={open}
			title={
				<Title order={3}>{`Are you sure you want to ${actionType} ${resourceLabel}?`}</Title>
			}
			onClose={onClose}
		>
			<ModalActions
				primaryAction={async () => {
					onClose()
					action()
				}}
				primaryLabel={`Yes, ${actionType} ${resourceLabel}`}
				secondaryAction={onClose}
				secondaryLabel='Cancel'
			/>
		</Modal>
	)
}

export default ConfirmationModal
