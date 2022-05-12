import { MultiSelect } from '@mantine/core'
import type React from 'react'
import { Controller } from 'react-hook-form'
import {
	TemporaryStudentPostBody,
	temporaryStudentPostSchema,
	updateStudent,
} from '../data/students'
import Form, { FormWrapperProps } from './form'
import type { RemoteFormWrapperProps } from './remote-form'
import RemoteForm from './remote-form'

export type StudentFormProps = FormWrapperProps<TemporaryStudentPostBody>

export const StudentForm: React.FC<StudentFormProps> = (props) => (
	<Form
		{...props}
		schema={temporaryStudentPostSchema}
		child={({ form }) => (
			<Controller
				name='memberships'
				control={form.control}
				render={({ field, fieldState }) => (
					<MultiSelect
						label='Memberships'
						data={[]}
						error={fieldState.error?.message}
						{...field}
						value={field.value?.map((snowflake) => snowflake!.toString())}
					/>
				)}
			/>
		)}
	/>
)

export type RemoteStudentFormProps =
	RemoteFormWrapperProps<TemporaryStudentPostBody> & {
		id: string
	}

export const RemoteStudentForm: React.FC<RemoteStudentFormProps> = ({
	id,
	...props
}) => (
	<RemoteForm
		{...props}
		queryKey={['students', { id }]}
		getResource={async () => ({ memberships: [] })}
		updateResource={(data) => updateStudent(id, data as any)}
		child={StudentForm}
	/>
)
