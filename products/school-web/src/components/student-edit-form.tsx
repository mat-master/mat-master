import type { SchoolStudentsMembershipsPutBody } from '@common/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { MultiSelect } from '@mantine/core'
import type React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import * as yup from 'yup'
import { getStudent, updateStudentMemberships } from '../data/students'
import Form, { FormProps } from './form'

const studentSchema: yup.SchemaOf<SchoolStudentsMembershipsPutBody> = yup.object({
	memberships: yup.array().of(yup.string().required()).required(),
})

export type StudentEditFormProps = FormProps & {
	id: string
}

const StudentEditForm: React.FC<StudentEditFormProps> = ({
	id,
	onSubmit,
	...props
}) => {
	const form = useForm<SchoolStudentsMembershipsPutBody>({
		defaultValues: {},
		resolver: yupResolver(studentSchema),
	})

	const queryKey = ['students', { id }] as const
	const { data, isLoading } = useQuery(
		queryKey,
		() => getStudent(id)
		// { onSuccess: (data) => form.reset({ memberships: })}
	)

	const queryClient = useQueryClient()
	const { mutateAsync } = useMutation(
		queryKey,
		(data: SchoolStudentsMembershipsPutBody) => updateStudentMemberships(id, data),
		{ onSuccess: () => queryClient.invalidateQueries(queryKey[0]) }
	)

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) =>
		form.handleSubmit(async (values) => {
			await mutateAsync(values)
			onSubmit && (await onSubmit(e))
		})(e)

	return (
		<Form {...props} onSubmit={handleSubmit}>
			<Controller
				name='memberships'
				control={form.control}
				render={({ field, fieldState }) => (
					<MultiSelect
						label='Memberships'
						data={[]}
						error={fieldState.error?.message}
						{...field}
						value={field.value?.map((snowflake) => snowflake.toString())}
					/>
				)}
			/>
		</Form>
	)
}

export default StudentEditForm
