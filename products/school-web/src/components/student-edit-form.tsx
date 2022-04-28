import type { SchoolStudentsMembershipsPutBody } from '@common/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { MultiSelect } from '@mantine/core'
import type React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
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

	const { data, isLoading } = useQuery(
		['students', id],
		() => getStudent(id)
		// { onSuccess: (data) => form.reset({ memberships: })}
	)

	const { mutateAsync } = useMutation(
		['students', id],
		(data: SchoolStudentsMembershipsPutBody) => updateStudentMemberships(id, data)
	)

	// const { touchedFields } = form.formState
	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
		await form.handleSubmit((values) => mutateAsync(values))(e)
		onSubmit && (await onSubmit(e))
		// const data = Object.fromEntries(
		// 	Object.entries(values).filter(
		// 		([key]) => !touchedFields[key as keyof SchoolStudentsMembershipsPutBody]
		// 	)
		// )
	}

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
