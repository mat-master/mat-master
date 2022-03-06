import { Group, LoadingOverlay, Modal, MultiSelect, Title } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import { useFormik } from 'formik'
import type React from 'react'
import { useContext } from 'react'
import * as yup from 'yup'
import membershipsContext from '../data/memberships-context'
import type { ResourceData } from '../data/resource-provider'
import studentsContext, { type Student } from '../data/students-context'
import usePromise from '../hooks/use-promise'
import setRemoteResource from '../utils/set-remote-resource'
import ModalActions from './modal-actions'

export interface StudentEditModalProps {
	open: boolean
	onClose: VoidFunction
	studentId?: string
}

type StudentData = ResourceData<Student>

const studentSchema: yup.SchemaOf<StudentData> = yup.object({
	memberships: yup.array().of(yup.string().required()).required(),
})

const StudentEditModal: React.FC<StudentEditModalProps> = ({ open, studentId, onClose }) => {
	const studentsSrc = useContext(studentsContext)
	const membershipsSrc = useContext(membershipsContext)
	const notifications = useNotifications()

	const form = useFormik<StudentData>({
		initialValues: { memberships: [] },
		validateOnBlur: false,
		validateOnChange: false,
		validationSchema: studentSchema,
		onSubmit: (values) => {
			onClose()
			form.resetForm()
			setRemoteResource(studentsSrc, values, {
				id: studentId,
				resourceLabel: 'Student',
				notifications,
			})
		},
	})

	const { loading: membershipsLoading, value: membershipOptions } = usePromise(async () => {
		const summaries = await membershipsSrc.getSummaries()
		return summaries.map(({ id, name }) => ({ value: id, label: name }))
	}, [membershipsSrc.summaries])

	const { loading: studentLoading, value: student } = usePromise(async () => {
		if (!studentId) return form.resetForm()
		const student = await studentsSrc.get(studentId)
		form.setValues(student)
	}, [studentId])

	return (
		<Modal opened={open} onClose={onClose} title={<Title order={3}>Student Name</Title>}>
			<LoadingOverlay visible={membershipsLoading || studentLoading} radius='sm' />

			<form onSubmit={form.handleSubmit}>
				<Group direction='column' spacing='sm' grow>
					<MultiSelect
						id='memberships'
						label='Memberships'
						value={form.values.memberships}
						data={membershipOptions ?? []}
						onChange={(value) => form.setFieldValue('memberships', value)}
						onBlur={form.handleBlur}
						error={form.errors.memberships}
					/>
				</Group>

				<ModalActions primaryLabel='Save' secondaryAction={onClose} secondaryLabel='Cancel' />
			</form>
		</Modal>
	)
}

export default StudentEditModal
