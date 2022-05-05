import type { SchoolClassesPostBody } from '@common/types'
import { validator } from '@common/util'
import { TextInput } from '@mantine/core'
import type React from 'react'
import { Controller } from 'react-hook-form'
import { createClass, getClass } from '../data/classes'
import ClassScheduleInput from './class-schedule-input'
import { defaultClassTime } from './class-time-input'
import Form, { FormWrapperProps } from './form'
import RemoteForm, { RemoteFormWrapperProps } from './remote-form'

export type ClassFormProps = FormWrapperProps<SchoolClassesPostBody>

export const ClassForm: React.FC<ClassFormProps> = (props) => (
	<Form
		{...props}
		schema={validator.api.schoolClassesPostSchema}
		child={({ form }) => {
			const { errors } = form.formState

			return (
				<>
					<TextInput
						label='Name'
						{...form.register('name')}
						error={errors.name?.message}
					/>
					<Controller
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
					/>
				</>
			)
		}}
	/>
)

export type RemoteClassFormProps = RemoteFormWrapperProps<SchoolClassesPostBody> & {
	id?: string
}

export const RemoteClassForm: React.FC<RemoteClassFormProps> = ({
	id = 'new',
	...props
}) => (
	<RemoteForm<SchoolClassesPostBody>
		{...props}
		queryKey={['classes', { id }]}
		getResource={id ? () => getClass(id) : undefined}
		createResource={id ? undefined : createClass}
		updateResource={id ? () => {} : undefined}
		child={ClassForm}
	/>
)