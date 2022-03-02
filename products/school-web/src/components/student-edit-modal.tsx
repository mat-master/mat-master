import { LoadingOverlay, MultiSelect, SelectItem } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';
import type React from 'react';
import { useContext, useEffect, useMemo } from 'react';
import { membershipsContext, Student, studentsContext } from '../data/resources-provider';
import usePromise from '../hooks/use-promise';
import Modal from './modal';
import ModalActions from './modal-actions';

type StudentData = Omit<Student, 'id'>;

export interface StudentEditModalProps {
	open: boolean;
	studentId?: string;
	onClose: VoidFunction;
}

const StudentEditModal: React.FC<StudentEditModalProps> = ({ studentId, open, onClose }) => {
	const studentsSrc = useContext(studentsContext);
	const notifications = useNotifications();

	const membershipsSrc = useContext(membershipsContext);
	const membershipOptions: SelectItem[] = useMemo(() => {
		const { summaries } = membershipsSrc;
		if (!summaries) return [];
		return summaries?.map(({ id, name }) => ({ value: id, label: name }));
	}, [membershipsSrc.summaries]);

	const initialValues: StudentData = { memberships: [] };
	const form = useForm<StudentData>({ initialValues });

	const { loading, error, value } = usePromise(async () => {
		const studentPromise = studentId
			? studentsSrc.get(studentId)
			: Promise.resolve(initialValues);
		return Promise.all([membershipsSrc.getSummaries(), studentPromise]);
	}, [studentId]);
	const [_, student] = value ? value : [undefined, undefined];

	useEffect(() => {
		student && form.setValues(student);
	}, [student]);

	const handleSave = async (data: StudentData) => {
		onClose();

		const gerund = studentId ? 'Updating' : 'Creating';
		const pastTense = studentId ? 'updated' : 'created';

		const notificationID = notifications.showNotification({
			message: `${gerund} student`,
			loading: true,
			autoClose: false,
			disallowClose: true,
		});

		try {
			if (studentId) {
				await studentsSrc.update(studentId, data);
			} else {
				await studentsSrc.create(data);
			}

			await new Promise((resolve) => setTimeout(resolve, 2000));

			notifications.updateNotification(notificationID, {
				id: notificationID,
				message: `Successfully ${pastTense} student`,
				loading: false,
			});
		} catch (error) {
			console.log(error);

			notifications.updateNotification(notificationID, {
				id: notificationID,
				message: `Something went wrong while ${gerund.toLowerCase()} '${name}'`,
				loading: false,
			});
		}
	};

	return (
		<Modal opened={open} onClose={onClose} title='Student Name'>
			<LoadingOverlay visible={loading} radius='sm' />
			<MultiSelect
				label='Memberships'
				data={membershipOptions}
				{...form.getInputProps('memberships')}
			/>

			<ModalActions
				primaryAction={() => handleSave(form.values)}
				primaryLabel='Save'
				secondaryAction={onClose}
				secondaryLabel='Cancel'
			/>
		</Modal>
	);
};

export default StudentEditModal;
