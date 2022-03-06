import { Group, LoadingOverlay, Modal, MultiSelect, TextInput, Title } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { useFormik } from 'formik'
import type React from 'react'
import { useContext } from 'react'
import * as yup from 'yup'
import classesContext, { type Class } from '../data/classes-context'
import membershipsContext from '../data/memberships-context'
import type { ResourceData } from '../data/resource-provider'
import usePromise from '../hooks/use-promise'
import setRemoteResource from '../utils/set-remote-resource'
import ClassScheduleInput from './class-schedule-input'
import { classTimeSchema } from './class-time-input'
import ModalActions from './modal-actions'

export interface ClassEditModalProps {
	open: boolean
	onClose: VoidFunction
	classId?: string
}

type ClassData = ResourceData<Class>

const classDataSchema: yup.SchemaOf<ClassData> = yup.object({
	name: yup.string().required('Required'),
	memberships: yup.array(yup.string().required()).required(),
	schedule: yup.array().of(classTimeSchema.nullable()).min(1, 'At least one time is required'),
})

const ClassEditModal: React.FC<ClassEditModalProps> = ({ open, onClose, classId }) => {
	const classesSrc = useContext(classesContext)
	const membershipsSrc = useContext(membershipsContext)
	const notifications = useNotifications()

	const form = useFormik<ClassData>({
		initialValues: { name: '', memberships: [], schedule: [null] },
		validateOnBlur: false,
		validateOnChange: false,
		validationSchema: classDataSchema,
		onSubmit: (values) => {
			onClose()
			form.resetForm()
			setRemoteResource(classesSrc, values, {
				id: classId,
				resourceLabel: values.name,
				notifications,
			})
		},
	})

	const { loading: membershipsLoading, value: membershipOptions } = usePromise(async () => {
		const summaries = await membershipsSrc.getSummaries()
		return summaries.map(({ id, name }) => ({ value: id, label: name }))
	}, [membershipsSrc.summaries])

	const { loading: classLoading, value: _class } = usePromise(async () => {
		if (!classId) return form.resetForm()
		const _class = await classesSrc.get(classId)
		form.setValues(_class)
		return _class
	}, [classId])

	return (
		<Modal
			opened={open}
			onClose={onClose}
			title={<Title order={3}>{_class?.name ?? 'New Class'}</Title>}
		>
			<LoadingOverlay visible={membershipsLoading || classLoading} radius='sm' />

			<form onSubmit={form.handleSubmit}>
				<Group direction='column' spacing='sm' grow>
					<TextInput
						id='name'
						label='Name'
						value={form.values.name}
						onChange={form.handleChange}
						onBlur={form.handleBlur}
						error={form.errors.name}
					/>
					<MultiSelect
						id='memberships'
						label='Memberships'
						value={form.values.memberships}
						data={membershipOptions ?? []}
						onChange={(value) => form.setFieldValue('classes', value)}
						onBlur={form.handleBlur}
						error={form.errors.memberships}
					/>
					<ClassScheduleInput
						label='Schedule'
						value={form.values.schedule}
						onChange={(value) => form.setFieldValue('schedule', value)}
						error={form.errors.schedule}
					/>
				</Group>

				<ModalActions primaryLabel='Save' secondaryAction={onClose} secondaryLabel='Cancel' />
			</form>
		</Modal>
	)
}

export default ClassEditModal
