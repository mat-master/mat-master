import type { SchoolStudentsMembershipsPutBody } from '@common/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { MultiSelect } from '@mantine/core'
import type React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import * as yup from 'yup'
import { getStudent, updateStudentMemberships } from '../data/students'
import Form from './form'

const studentSchema: yup.SchemaOf<SchoolStudentsMembershipsPutBody> = yup.object({
	memberships: yup.array().of(yup.string().required()).required(),
})

export interface StudentEditFormProps {
	id: string
}

const StudentEditForm: React.FC<StudentEditFormProps> = ({ id }) => {
	const form = useForm<SchoolStudentsMembershipsPutBody>({
		defaultValues: {},
		resolver: yupResolver(studentSchema),
	})

	const { mutateAsync } = useMutation(
		['students', id],
		(data: SchoolStudentsMembershipsPutBody) => updateStudentMemberships(id, data)
	)

	const { data, isLoading } = useQuery(
		['students', id],
		() => getStudent(id)
		// { onSuccess: (data) => form.reset({ memberships: })}
	)

	// const { touchedFields } = form.formState
	const handleSubmit = (values: SchoolStudentsMembershipsPutBody) => {
		// const data = Object.fromEntries(
		// 	Object.entries(values).filter(
		// 		([key]) => !touchedFields[key as keyof SchoolStudentsMembershipsPutBody]
		// 	)
		// )

		return mutateAsync(values)
	}

	return (
		<Form>
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
