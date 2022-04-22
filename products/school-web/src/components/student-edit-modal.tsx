import type { SchoolStudentsMembershipsPutBody } from '@common/types'
import { yupResolver } from '@hookform/resolvers/yup'
import {
	Button,
	Group,
	LoadingOverlay,
	Modal,
	ModalProps,
	MultiSelect,
	Title,
} from '@mantine/core'
import type React from 'react'
import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import * as yup from 'yup'
import { getMemberships } from '../data/memberships'
import { getStudent, updateStudentMemberships } from '../data/students'

const studentSchema: yup.SchemaOf<SchoolStudentsMembershipsPutBody> = yup.object({
	memberships: yup.array().of(yup.string().required()).required(),
})

const StudentEditModal: React.FC<ModalProps & { studentId?: string }> = ({
	studentId,
	...props
}) => {
	const { mutateAsync } = useMutation((data: SchoolStudentsMembershipsPutBody) => {
		if (studentId) return updateStudentMemberships(studentId, data)
		throw 'Students must be invited'
	})

	const form = useForm<SchoolStudentsMembershipsPutBody>({
		resolver: yupResolver(studentSchema),
	})

	const handleClose = () => {
		props.onClose()
		form.reset()
		form.clearErrors()
	}

	const handleSubmit = async (values: SchoolStudentsMembershipsPutBody) => {
		await mutateAsync(values)
		handleClose()
	}

	const { data: student, isLoading: studentLoading } = useQuery(
		['students', { id: studentId }],
		() => getStudent(studentId ?? ''),
		{ enabled: !!studentId }
	)

	const { data: memberships, isLoading: membershipsLoading } = useQuery(
		'memberships',
		getMemberships
	)
	const membershipOptions = useMemo(
		() => memberships?.map(({ id, name }) => ({ value: id.toString(), label: name })),
		[memberships]
	)

	return (
		<Modal
			title={<Title order={3}>{`${student?.user.firstName} ${student?.user.lastName}`}</Title>}
			{...props}
		>
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
								value={field.value?.map((snowflake) => snowflake.toString())}
							/>
						)}
					/>
					<Group position='right'>
						<Button type='submit' loading={form.formState.isSubmitting}>
							Save
						</Button>
					</Group>
				</Group>
			</form>
		</Modal>
	)
}

export default StudentEditModal
