import { validator } from '@common/util'
import { yupResolver } from '@hookform/resolvers/yup'
import {
	Group,
	LoadingOverlay,
	Modal,
	ModalProps,
	MultiSelect,
	TextInput,
	Title,
} from '@mantine/core'
import { useNotifications } from '@mantine/notifications'
import type React from 'react'
import { useContext, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import classesContext, { type Class } from '../data/classes-context'
import membershipsContext from '../data/memberships-context'
import type { ResourceData } from '../data/resource-provider'
import usePromise from '../hooks/use-promise'
import setRemoteResource from '../utils/set-remote-resource'
import ClassScheduleInput from './class-schedule-input'
import { defaultClassTime } from './class-time-input'
import ModalActions from './modal-actions'

export interface ClassEditModalProps {
	open: boolean
	onClose: VoidFunction
	classId?: string
}

type ClassData = ResourceData<Class>

const classDataSchema: yup.SchemaOf<ClassData> = yup.object({
	name: yup.string().required('Required'),
	memberships: yup.array(yup.string().required()).required(),
	schedule: yup.array().of(validator.classTimeSchema).min(1, 'At least one time is required'),
})

const defaultClassData: ClassData = { name: '', memberships: [], schedule: [defaultClassTime] }

const ClassEditModal: React.FC<ModalProps & { classId?: string }> = ({ classId, ...props }) => {
	const classesSrc = useContext(classesContext)
	const membershipsSrc = useContext(membershipsContext)
	const notifications = useNotifications()

	const form = useForm<ClassData>({
		defaultValues: defaultClassData,
		resolver: yupResolver(classDataSchema),
	})

	const handleSubmit = (values: ClassData) => {
		props.onClose()
		setRemoteResource(classesSrc, {
			id: classId,
			data: values,
			resourceLabel: values.name,
			notifications,
		})
	}

	useEffect(() => {
		!props.opened && form.reset(defaultClassData)
	}, [props.opened])

	const { loading: membershipsLoading, value: membershipOptions } = usePromise(async () => {
		const summaries = await membershipsSrc.getSummaries()
		return summaries.map(({ id, name }) => ({ value: id, label: name }))
	}, [membershipsSrc.summaries])

	const { loading: classLoading, value: _class } = usePromise(async () => {
		if (!classId) return
		const _class = await classesSrc.get(classId)
		form.reset(_class)
		return _class
	}, [classId])

	return (
		<Modal title={<Title order={3}>{_class?.name ?? 'New Class'}</Title>} {...props}>
			<LoadingOverlay visible={membershipsLoading || classLoading} radius='sm' />

			<form onSubmit={form.handleSubmit(handleSubmit)}>
				<Group direction='column' spacing='sm' grow>
					<TextInput
						label='Name'
						{...form.register('name')}
						error={form.formState.errors.name?.message}
					/>
					<Controller
						name='memberships'
						control={form.control}
						defaultValue={[]}
						render={({ field, fieldState }) => (
							<MultiSelect
								label='Memberships'
								data={membershipOptions ?? []}
								error={fieldState.error?.message}
								{...field}
							/>
						)}
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
				</Group>

				<ModalActions
					primaryLabel='Save'
					secondaryAction={props.onClose}
					secondaryLabel='Cancel'
				/>
			</form>
		</Modal>
	)
}

export default ClassEditModal
