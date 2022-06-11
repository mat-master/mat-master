import { TextInput } from '@mantine/core'
import { Snowflake } from '@mat-master/api'
import type React from 'react'
import { useContext } from 'react'
import { z } from 'zod'
import { trpcClient } from '..'
import { schoolContext } from '../data/school-provider'
import Form, { FormWrapperProps } from './form'
import RemoteForm, { RemoteFormWrapperProps } from './remote-form'

export const classFormDataSchema = z.object({
	name: z.string(),
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
					{/* <Controller
						name='schedule'
						control={form.control}
						defaultValue={[defaultClassTime]}
						render={({ field, fieldState }) => (
							<ClassScheduleInput
								label='Schedule'
								error={fieldState.error?.message}
								{...field}
							/>
						)}
					/> */}
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
	const { id: schoolId } = useContext(schoolContext)
	return (
		<RemoteForm<ClassFormData>
			{...props}
			queryKey={['classes', { id }]}
			getResource={
				id
					? () => trpcClient.query('school.classes.get', { id, schoolId })
					: undefined
			}
			createResource={
				id
					? undefined
					: (data) =>
							trpcClient.mutation('school.classes.create', { schoolId, ...data })
			}
			updateResource={
				id
					? (data) =>
							trpcClient.mutation('school.classes.update', {
								id,
								schoolId,
								...data,
							})
					: undefined
			}
			child={ClassForm}
		/>
	)
}
