import {
	ActionIcon,
	Box,
	createStyles,
	Modal as MantineModal,
	ModalProps as MantineModalProps,
	Title,
} from '@mantine/core';
import React from 'react';
import { X as CloseIcon } from 'react-feather';

export type ModalProps = Omit<MantineModalProps, 'hideCloseButton'>;

const useStyles = createStyles((theme) => ({
	head: {
		display: 'grid',
		gridTemplateColumns: 'auto min-content',
		gridTemplateRows: '1fr',
		marginBottom: theme.spacing.xs,
	},
}));

const Modal: React.FC<ModalProps> = (props) => {
	const { classes } = useStyles();

	return (
		<MantineModal hideCloseButton {...props} title={undefined}>
			<Box className={classes.head}>
				<Title order={3}>{props.title}</Title>
				<ActionIcon>
					<CloseIcon size={18} onClick={props.onClose} />
				</ActionIcon>
			</Box>
			{props.children}
		</MantineModal>
	);
};

export default Modal;
