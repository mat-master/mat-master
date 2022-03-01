import { MultiSelect, Select } from '@mantine/core';
import type React from 'react';
import Modal from './modal';
import ModalActions from './modal-actions';

export interface StudentEditModalProps {
	open: boolean;
	onClose: VoidFunction;
}

const StudentEditModal: React.FC<StudentEditModalProps> = ({ open, onClose }) => {
	return (
		<Modal opened={open} onClose={onClose} title='Student Name'>
			<MultiSelect
				label='Memberships'
				data={[]}
				// data={memberships.map(({ id, name }) => ({ value: id, label: name }))}
			/>

			<Select label='TaeKwonDo Rank' data={['White', 'Yellow', 'Orange']} />

			<ModalActions
				primaryAction={() => {}}
				primaryLabel='Save'
				secondaryAction={onClose}
				secondaryLabel='Cancel'
			/>
		</Modal>
	);
};

export default StudentEditModal;
