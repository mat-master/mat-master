import { MultiSelect, Textarea, TextInput } from '@mantine/core';
import type React from 'react';
import { memberships } from '../pages/memberships';
import ClassScheduleInput from './class-schedule-input';
import Modal from './modal';
import ModalActions from './modal-actions';

export interface ClassEditModalProps {
	open: boolean;
	onClose: VoidFunction;
}

const ClassEditModal: React.FC<ClassEditModalProps> = ({ open, onClose }) => {
	return (
		<Modal opened={open} onClose={onClose} title='Class Name'>
			<TextInput label='Name' />

			<Textarea label='Description' minRows={3} maxRows={8} autosize />

			<MultiSelect
				label='Memberships'
				data={memberships.map(({ id, name }) => ({ value: id, label: name }))}
			/>

			<ClassScheduleInput />

			<ModalActions
				primaryAction={() => {}}
				primaryLabel='Save'
				secondaryAction={onClose}
				secondaryLabel='Cancel'
			/>
		</Modal>
	);
};

export default ClassEditModal;
