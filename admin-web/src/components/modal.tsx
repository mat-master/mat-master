import {
	ActionIcon,
	Box,
	createStyles,
	Group,
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
	},
}));

const Modal: React.FC<ModalProps> = (props) => {
	const { classes } = useStyles();

	return (
		<MantineModal hideCloseButton {...props} title={undefined}>
			<Group direction='column' spacing='sm' grow>
				<Box className={classes.head}>
					<Title order={3}>{props.title}</Title>
					<ActionIcon>
						<CloseIcon size={18} onClick={props.onClose} />
					</ActionIcon>
				</Box>
				{props.children}
			</Group>
		</MantineModal>
	);
};

export default Modal;
