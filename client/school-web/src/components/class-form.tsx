import { InputWrapper, TextInput } from '@mantine/core'
import { classTimeSchema, Snowflake } from '@mat-master/common'
import type React from 'react'
import { Controller } from 'react-hook-form'
import { z } from 'zod'
import getSchoolId from '../utils/get-school-id'
import ClassScheduleInput from './class-schedule-input'
import Form, { FormWrapperProps } from './form'
import RemoteForm, { RemoteFormWrapperProps } from './remote-form'

const classFormDataSchema = z.object({
	name: z.string().min(1, 'required'),
	schedule: classTimeSchema.omit({ id: true, classId: true }).array(),
})

export type ClassFormData = z.infer<typeof classFormDataSchema>
export type ClassFormProps = FormWrapperProps<ClassFormData>

export const ClassForm: React.FC<ClassFormProps> = (props) => (
	<Form<ClassFormData>
		{...props}
		schema={classFormDataSchema}
		child={({ form }) => {
			const { errors } = form.formState

			return (
				<>
					<TextInput
						label='Name'
						{...form.register('name')}
						error={errors.name?.message}
					/>

					<InputWrapper label='Class Times'>
						<Controller
							control={form.control}
							name='schedule'
							render={({ field, fieldState }) => (
								<ClassScheduleInput {...field} error={fieldState.error?.message} />
							)}
						/>
					</InputWrapper>
				</>
			)
		}}
	/>
)

export type RemoteClassFormProps = RemoteFormWrapperProps<ClassFormData> & {
	id?: Snowflake
}

export const RemoteClassForm: React.FC<RemoteClassFormProps> = ({
	id,
	...props
}) => {
	const schoolId = getSchoolId()!
	return (
		<RemoteForm<ClassFormData>
			{...props}
			queryKey={['classes', { id }]}
			// getResource={
			// 	id
			// 		? () => trpcClient.query('school.classes.get', { id, schoolId })
			// 		: undefined
			// }
			// createResource={
			// 	id
			// 		? undefined
			// 		: (data) =>
			// 				trpcClient.mutation('school.classes.create', { schoolId, ...data })
			// }
			// updateResource={
			// 	id
			// 		? (data) =>
			// 				trpcClient.mutation('school.classes.update', {
			// 					id,
			// 					schoolId,
			// 					...data,
			// 				})
			// 		: undefined
			// }
			child={ClassForm}
		/>
	)
}
