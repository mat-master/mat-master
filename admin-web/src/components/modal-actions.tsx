import { Button, Group } from '@mantine/core';
import React from 'react';

export interface ModalActionsProps {
	primaryAction: VoidFunction;
	primaryLabel: React.ReactNode;
	secondaryAction?: VoidFunction;
	secondaryLabel?: React.ReactNode;
}

const ModalActions: React.FC<ModalActionsProps> = ({
	primaryAction,
	primaryLabel,
	secondaryAction,
	secondaryLabel,
}) => (
	<Group position='right' style={{ width: '100%' }}>
		{secondaryAction && (
			<Button variant='outline' onClick={secondaryAction}>
				{secondaryLabel}
			</Button>
		)}

		<Button onClick={primaryAction}>{primaryLabel}</Button>
	</Group>
);

export default ModalActions;
