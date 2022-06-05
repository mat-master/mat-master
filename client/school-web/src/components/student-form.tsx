import { MultiSelect } from '@mantine/core'
import { Snowflake } from '@mat-master/api'
import type React from 'react'
import { useContext } from 'react'
import { z } from 'zod'
import { trpcClient } from '..'
import { schoolContext } from '../data/school-provider'
import Form, { FormWrapperProps } from './form'
import type { RemoteFormWrapperProps } from './remote-form'
import RemoteForm from './remote-form'

export const studentFormDataSchema = z.object({})

export type StudentFormData = z.infer<typeof studentFormDataSchema>
export type StudentFormProps = FormWrapperProps<StudentFormData>

export const StudentForm: React.FC<StudentFormProps> = (props) => (
	<Form<StudentFormData>
		{...props}
		schema={studentFormDataSchema}
		child={({ form }) => <MultiSelect label='Memberships' data={[]} />}
	/>
)

export type RemoteStudentFormProps = RemoteFormWrapperProps<StudentFormData> & {
	id: Snowflake
}

export const RemoteStudentForm: React.FC<RemoteStudentFormProps> = ({
	id,
	...props
}) => {
	const { id: schoolId } = useContext(schoolContext)
	return (
		<RemoteForm<StudentFormData>
			{...props}
			queryKey={['students', { id }]}
			getResource={() => trpcClient.query('school.students.get', { id, schoolId })}
			child={StudentForm}
		/>
	)
}
