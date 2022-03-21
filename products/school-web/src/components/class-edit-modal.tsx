import { validator } from '@common/util'
import { yupResolver } from '@hookform/resolvers/yup'
import {
	Button,
	Group,
	LoadingOverlay,
	Modal,
	ModalProps,
	MultiSelect,
	TextInput,
	Title,
} from '@mantine/core'
import type React from 'react'
import { useContext, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import * as yup from 'yup'
import { createClass } from '../data/classes'
import classesContext, { type Class } from '../data/classes-context'
import { getMemberships } from '../data/memberships'
import type { ResourceData } from '../data/resource-provider'
import usePromise from '../hooks/use-promise'
import ClassScheduleInput from './class-schedule-input'
import { defaultClassTime } from './class-time-input'

export interface ClassEditModalProps {
	open: boolean
	onClose: VoidFunction
	classId?: string
}

type ClassData = ResourceData<Class>

const classDataSchema: yup.SchemaOf<ClassData> = yup.object({
	name: yup.string().required(),
	memberships: yup.array(yup.string().required()).required(),
	schedule: yup.array().of(validator.classTimeSchema).min(1, 'At least one time is required'),
})

const defaultClassData: ClassData = { name: '', memberships: [], schedule: [defaultClassTime] }

const ClassEditModal: React.FC<ModalProps & { classId?: string }> = ({ classId, ...props }) => {
	const classesSrc = useContext(classesContext)
	const queryClient = useQueryClient()
	const { mutateAsync, isLoading: mutationWorking } = useMutation(
		({ name, schedule }: ClassData) => {
			queryClient.invalidateQueries('classes')
			if (classId) throw 'Unimplemented'
			return createClass({ name, schedule })
		}
	)

	const form = useForm<ClassData>({
		defaultValues: defaultClassData,
		resolver: yupResolver(classDataSchema),
	})

	const handleSubmit = async (values: ClassData) => {
		await mutateAsync(values)
		props.onClose()
		form.reset()
	}

	const { data: memberships, isLoading: membershipsLoading } = useQuery(
		'memberships',
		getMemberships
	)
	const membershipOptions = useMemo(
		() => memberships?.map(({ id, name }) => ({ value: id.toString(), label: name })) ?? [],
		[memberships]
	)

	const { loading: classLoading, value: _class } = usePromise(async () => {
		if (!classId) return
		const _class = await classesSrc.get(classId)
		form.reset(_class)
		return _class
	}, [classId])

	return (
		<Modal
			title={<Title order={3}>{_class?.name ?? 'New Class'}</Title>}
			{...props}
			onClose={() => !mutationWorking && props.onClose()}
		>
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
					<Group position='right'>
						<Button type='submit' loading={mutationWorking}>
							{classId ? 'Save' : 'Create'}
						</Button>
					</Group>
				</Group>
			</form>
		</Modal>
	)
}

export default ClassEditModal
