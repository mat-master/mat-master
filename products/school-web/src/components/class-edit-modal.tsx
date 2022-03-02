import { LoadingOverlay, MultiSelect, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';
import type React from 'react';
import { useContext, useEffect, useState } from 'react';
import { classesContext } from '../data/resources-provider';
import type { ClassTime } from '../utils/class-time-serialization';
import ClassScheduleInput from './class-schedule-input';
import Modal from './modal';
import ModalActions from './modal-actions';

export interface ClassData {
	name: string;
	memberships: string[];
	schedule: ClassTime[];
}

export interface ClassEditModalProps {
	open: boolean;
	onClose: VoidFunction;
	classId?: string;
}

const ClassEditModal: React.FC<ClassEditModalProps> = ({ open, onClose, classId }) => {
	const classes = useContext(classesContext);
	const notifications = useNotifications();

	const initialValues: ClassData = { name: '', memberships: [], schedule: [] };
	const form = useForm<ClassData>({ initialValues });

	const [loading, setLoading] = useState(true);
	const effect = async () => {
		if (!classId) return setLoading(false);

		try {
			const data = await classes.get(classId);
		} catch (error) {}
	};

	useEffect(() => {
		effect();
	}, []);

	const handleClose = () => {
		onClose();
	};

	const handleSave = async () => {
		handleClose();

		const gerund = classId ? 'Updating' : 'Creating';
		const pastTense = classId ? 'updated' : 'created';
		const { name } = form.values;

		const notificationID = notifications.showNotification({
			message: `${gerund} '${name}'`,
			loading: true,
			autoClose: false,
			disallowClose: true,
		});

		try {
			// if (initialValues) {
			// 	await classes.update('', form.values);
			// } else {
			// 	await classes.create(form.values);
			// }

			await new Promise((resolve) => setTimeout(resolve, 2000));

			notifications.updateNotification(notificationID, {
				id: notificationID,
				message: `Successfully ${pastTense} '${form.values.name}'`,
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
		<Modal opened={open} onClose={onClose} title='Class Name'>
			<LoadingOverlay radius='sm' visible />
			<TextInput label='Name' {...form.getInputProps('name')} />

			<MultiSelect
				label='Memberships'
				data={[]}
				// data={memberships.map(({ id, name }) => ({ value: id, label: name }))}
				{...form.getInputProps('memberships')}
			/>

			<ClassScheduleInput {...form.getInputProps('schedule')} />

			<ModalActions
				primaryAction={handleSave}
				primaryLabel='Save'
				secondaryAction={onClose}
				secondaryLabel='Cancel'
			/>
		</Modal>
	);
};

export default ClassEditModal;
