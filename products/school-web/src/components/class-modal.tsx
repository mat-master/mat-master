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
import { useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { createClass, getClasses } from '../data/classes'
import ClassScheduleInput from './class-schedule-input'
import { defaultClassTime } from './class-time-input'

export interface ClassEditModalProps {
	open: boolean
	onClose: VoidFunction
	classId?: string
}

const ClassEditModal: React.FC<ModalProps & { classId?: string }> = ({ classId, ...props }) => {
	const queryClient = useQueryClient()
	const { mutateAsync } = useMutation(({ name, schedule }: SchoolClassesPostBody) => {
		queryClient.invalidateQueries('classes')
		if (classId) throw 'Unimplemented'
		return createClass({ name, schedule })
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

	const { data: classes, isLoading: classLoading } = useQuery('classes', getClasses, {
		enabled: !!classId,
	})
	const _class = useMemo(() => {
		const _class = classes?.find(({ id }) => id === classId)
		if (_class) form.reset(_class)
		return _class
	}, [classes, classId])

	return (
		<Modal
			title={<Title order={3}>{_class?.name ?? 'New Class'}</Title>}
			{...props}
			onClose={handleClose}
		>
			<LoadingOverlay visible={classLoading} radius='sm' />

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

export default ClassEditModal
