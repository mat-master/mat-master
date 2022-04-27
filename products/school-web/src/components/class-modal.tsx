import type { SchoolClassesPostBody } from '@common/types'
import { validator } from '@common/util'
import { yupResolver } from '@hookform/resolvers/yup'
import {
	Button,
	Group,
	LoadingOverlay,
	Modal,
	ModalProps,
	TextInput,
	Title,
} from '@mantine/core'
import type React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery } from 'react-query'
import { createClass, getClass } from '../data/classes'
import ClassScheduleInput from './class-schedule-input'
import { defaultClassTime } from './class-time-input'

const ClassModal: React.FC<ModalProps & { classId?: string }> = ({
	classId,
	...props
}) => {
	const { mutateAsync } = useMutation((data: SchoolClassesPostBody) => {
		if (classId) throw 'Unimplemented'
		return createClass(data)
	})

	const form = useForm<SchoolClassesPostBody>({
		resolver: yupResolver(validator.api.schoolClassesPostSchema),
	})

	const handleClose = () => {
		props.onClose()
		form.reset({ name: '', schedule: [defaultClassTime] })
		form.clearErrors()
	}

	const handleSubmit = async (values: SchoolClassesPostBody) => {
		await mutateAsync(values)
		handleClose()
	}

	const { data: _class, isLoading } = useQuery(
		[classId],
		async () => {
			const _class = await getClass(classId ?? '')
			form.reset(_class)
			return _class
		},
		{ enabled: !!classId }
	)

	return (
		<Modal
			title={<Title order={3}>{_class?.name ?? 'New Class'}</Title>}
			{...props}
			onClose={handleClose}
		>
			<LoadingOverlay visible={isLoading} radius='sm' />

			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<Group direction='column' spacing='sm' grow>
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
					<Group position='right'>
						<Button type='submit' loading={form.formState.isSubmitting}>
							{classId ? 'Save' : 'Create'}
						</Button>
					</Group>
				</Group>
			</form>
		</Modal>
	)
}

export default ClassModal
