import { yupResolver } from '@hookform/resolvers/yup'
import { Group, LoadingOverlay, Modal, ModalProps, MultiSelect, Title } from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import type React from 'react'
import { useContext, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import membershipsContext from '../data/memberships-context'
import type { ResourceData } from '../data/resource-provider'
import studentsContext, { type Student } from '../data/students-context'
import usePromise from '../hooks/use-promise'
import setRemoteResource from '../utils/set-remote-resource'
import ModalActions from './modal-actions'

type StudentData = ResourceData<Student>

const studentSchema: yup.SchemaOf<StudentData> = yup.object({
	memberships: yup.array().of(yup.string().required()).required(),
})

const defaultStudentData: StudentData = {
	memberships: [],
}

const StudentEditModal: React.FC<ModalProps & { studentId?: string }> = ({
	studentId,
	...props
}) => {
	const studentsSrc = useContext(studentsContext)
	const membershipsSrc = useContext(membershipsContext)
	const notifications = useNotifications()

	const form = useForm<StudentData>({
		defaultValues: defaultStudentData,
		resolver: yupResolver(studentSchema),
	})

	const handleSubmit = (values: StudentData) => {
		props.onClose()
		setRemoteResource(studentsSrc, {
			id: studentId,
			data: values,
			resourceLabel: 'Student',
			notifications,
		})
	}

	useEffect(() => {
		!props.opened && form.reset(defaultStudentData)
	}, [props.opened])

	const { loading: membershipsLoading, value: membershipOptions } = usePromise(async () => {
		const summaries = await membershipsSrc.getSummaries()
		return summaries.map(({ id, name }) => ({ value: id, label: name }))
	}, [membershipsSrc.summaries])

	const { loading: studentLoading } = usePromise(async () => {
		if (!studentId) return
		const student = await studentsSrc.get(studentId)
		form.reset(student)
	}, [studentId])

	return (
		<Modal title={<Title order={3}>Student Name</Title>} {...props}>
			<LoadingOverlay visible={membershipsLoading || studentLoading} radius='sm' />

			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<Group direction='column' spacing='sm' grow>
					<Controller
						name='memberships'
						control={form.control}
						render={({ field, fieldState }) => (
							<MultiSelect
								label='Memberships'
								data={membershipOptions ?? []}
								error={fieldState.error?.message}
								{...field}
							/>
						)}
					/>
				</Group>

				<ModalActions
					primaryLabel='Save'
					secondaryAction={props.onClose}
					secondaryLabel='Cancel'
				/>
			</form>
		</Modal>
	)
}

export default StudentEditModal
