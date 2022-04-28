import type { SchoolClassesPostBody } from '@common/types'
import { validator } from '@common/util'
import { yupResolver } from '@hookform/resolvers/yup'
import { TextInput } from '@mantine/core'
import type React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { createClass, getClass } from '../data/classes'
import ClassScheduleInput from './class-schedule-input'
import { defaultClassTime } from './class-time-input'
import Form, { FormProps } from './form'

export type ClassFormProps = FormProps & {
	id?: string
}

const ClassForm: React.FC<ClassFormProps> = ({ id, onSubmit, ...props }) => {
	const form = useForm<SchoolClassesPostBody>({
		defaultValues: {},
		resolver: yupResolver(validator.api.schoolClassesPostSchema),
	})

	const { isLoading } = useQuery(['classes', id], () => getClass(id!), {
		enabled: !!id,
		onSuccess: form.reset,
	})

	const { mutateAsync } = useMutation(
		['classes', id],
		(values: SchoolClassesPostBody) => {
			if (!id) return createClass(values)
			throw 'Unimplemented'
		}
	)

	const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
		await form.handleSubmit((values) => mutateAsync(values))(e)
		onSubmit && (await onSubmit(e))
	}

	return (
		<Form
			loading={isLoading}
			// error={(fetchError || createMutation.error || updateMutation.error)}
			{...props}
			onSubmit={handleSubmit}
		>
			<TextInput
				label='Name'
				{...form.register('name')}
				error={form.formState.errors.name?.message}
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
		</Form>
	)
}

export default ClassForm
