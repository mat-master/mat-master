import { LoadingOverlay, MultiSelect, SelectItem } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import type React from 'react';
import { useContext, useEffect, useMemo } from 'react';
import { membershipsContext, Student, studentsContext } from '../data/resources-provider';
import usePromise from '../hooks/use-promise';
import useResourceAction from '../hooks/use-resource-action';
import Modal from './modal';
import ModalActions from './modal-actions';

type StudentData = Omit<Student, 'id'>;

export interface StudentEditModalProps {
	studentId: string;
	onClose?: VoidFunction;
}

const StudentEditModal: React.FC<StudentEditModalProps> = ({ studentId, onClose }) => {
	const studentsSrc = useContext(studentsContext);
	const membershipsSrc = useContext(membershipsContext);
	const membershipOptions: SelectItem[] = useMemo(() => {
		const { summaries } = membershipsSrc;
		if (!summaries) return [];
		return summaries?.map(({ id, name }) => ({ value: id, label: name }));
	}, [membershipsSrc.summaries]);

	const initialValues: StudentData = { memberships: [] };
	const form = useForm<StudentData>({ initialValues });

	const { loading, error, value } = usePromise(
		async () => Promise.all([membershipsSrc.getSummaries(), studentsSrc.get(studentId)]),
		[studentId]
	);

	const [_, student] = value ? value : [undefined, undefined];

	useEffect(() => {
		student && form.setValues(student);
	}, [student]);

	const onSave = async () => {
		onClose && onClose();

		if (studentId) {
			await studentsSrc.update(studentId, form.values);
		} else {
			await studentsSrc.create(form.values);
		}
	};

	const handleSave = useResourceAction(onSave, 'update', 'Student Name');

	return (
		<Modal onClose={onClose ?? (() => {})} title='Student Name' opened>
			<LoadingOverlay visible={loading} radius='sm' />
			<MultiSelect
				label='Memberships'
				data={membershipOptions}
				{...form.getInputProps('memberships')}
			/>

			<ModalActions
				primaryAction={handleSave}
				primaryLabel='Save'
				secondaryAction={onClose}
				secondaryLabel='Cancel'
			/>
		</Modal>
	);
};

export default StudentEditModal;
