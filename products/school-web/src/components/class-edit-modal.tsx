import { LoadingOverlay, MultiSelect, SelectItem, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useNotifications } from '@mantine/notifications';
import type React from 'react';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { Class, classesContext, membershipsContext } from '../data/resources-provider';
import usePromise from '../hooks/use-promise';
import ClassScheduleInput from './class-schedule-input';
import Modal from './modal';
import ModalActions from './modal-actions';

type ClassData = Omit<Class, 'id'>;

export interface ClassEditModalProps {
	onClose: VoidFunction;
	classId?: string;
}

const ClassEditModal: React.FC<ClassEditModalProps> = ({ onClose, classId }) => {
	const classesSrc = useContext(classesContext);
	const notifications = useNotifications();

	const membershipsSrc = useContext(membershipsContext);
	const membershipOptions: SelectItem[] = useMemo(() => {
		const { summaries } = membershipsSrc;
		if (!summaries) return [];
		return summaries?.map(({ id, name }) => ({ value: id, label: name }));
	}, [membershipsSrc.summaries]);

	const initialValues: ClassData = { name: '', memberships: [], schedule: [] };
	const form = useForm<ClassData>({ initialValues });

	const { loading, error, value } = usePromise(async () => {
		const classPromise = classId ? classesSrc.get(classId) : Promise.resolve(initialValues);
		return Promise.all([membershipsSrc.getSummaries(), classPromise]);
	}, [classId]);
	const [_, classData] = value ? value : [undefined, undefined];

	useEffect(() => {
		classData && form.setValues(classData);
	}, [classData]);

	const handleSave = useCallback(
		async (data: ClassData) => {
			onClose();

			const gerund = classId ? 'Updating' : 'Creating';
			const pastTense = classId ? 'updated' : 'created';

			const notificationID = notifications.showNotification({
				message: `${gerund} '${data.name}'`,
				loading: true,
				autoClose: false,
				disallowClose: true,
			});

			try {
				if (classId) {
					await classesSrc.update(classId, data);
				} else {
					await classesSrc.create(data);
				}

				await new Promise((resolve) => setTimeout(resolve, 2000));

				notifications.updateNotification(notificationID, {
					id: notificationID,
					message: `Successfully ${pastTense} '${data.name}'`,
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
		},
		[classId]
	);

	return (
		<Modal opened onClose={onClose} title='Class Name'>
			<LoadingOverlay visible={loading} radius='sm' />
			<TextInput label='Name' {...form.getInputProps('name')} />

			<MultiSelect
				label='Memberships'
				data={membershipOptions}
				{...form.getInputProps('memberships')}
			/>

			<ClassScheduleInput {...form.getInputProps('schedule')} />

			<ModalActions
				primaryAction={() => handleSave(form.values)}
				primaryLabel='Save'
				secondaryAction={onClose}
				secondaryLabel='Cancel'
			/>
		</Modal>
	);
};

export default ClassEditModal;
