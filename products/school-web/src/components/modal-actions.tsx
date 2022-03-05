import { Button, Group } from '@mantine/core';
import type React from 'react';

export interface ModalActionsProps {
	primaryLabel: React.ReactNode
	primaryAction?: VoidFunction
	secondaryLabel?: React.ReactNode
	secondaryAction?: VoidFunction
}

const ModalActions: React.FC<ModalActionsProps> = ({
	primaryAction,
	primaryLabel,
	secondaryAction,
	secondaryLabel,
}) => (
	<Group mt='sm' style={{ width: '100%' }} grow>
		{secondaryAction && (
			<Button variant='outline' onClick={secondaryAction}>
				{secondaryLabel}
			</Button>
		)}

		<Button type={primaryAction ? 'button' : 'submit'} onClick={primaryAction}>
			{primaryLabel}
		</Button>
	</Group>
)

export default ModalActions;
