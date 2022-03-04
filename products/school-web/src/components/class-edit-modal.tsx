import { LoadingOverlay, Modal, MultiSelect, SelectItem, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/hooks'
import type React from 'react'
import { useContext, useEffect, useMemo } from 'react'
import classesContext, { type Class } from '../data/classes-context'
import membershipsContext from '../data/memberships-context'
import useAsyncAction from '../hooks/use-async-action'
import usePromise from '../hooks/use-promise'
import ClassScheduleInput from './class-schedule-input'
import ModalActions from './modal-actions'

type ClassData = Omit<Class, 'id'>

export interface ClassEditModalProps {
	onClose?: VoidFunction
	classId?: string
}

const ClassEditModal: React.FC<ClassEditModalProps> = ({ onClose, classId }) => {
	const classesSrc = useContext(classesContext)
	const membershipsSrc = useContext(membershipsContext)
	const membershipOptions: SelectItem[] = useMemo(() => {
		const { summaries } = membershipsSrc
		if (!summaries) return []
		return summaries?.map(({ id, name }) => ({ value: id, label: name }))
	}, [membershipsSrc.summaries])

	const initialValues: ClassData = { name: '', memberships: [], schedule: [null] }
	const form = useForm<ClassData>({ initialValues })

	const { loading, error, value } = usePromise(async () => {
		const classPromise = classId ? classesSrc.get(classId) : Promise.resolve(initialValues)
		return Promise.all([membershipsSrc.getSummaries(), classPromise])
	}, [classId])
	const [_, classData] = value ? value : [undefined, undefined]

	useEffect(() => {
		classData && form.setValues(classData)
	}, [classData])

	const onSave = async () => {
		onClose && onClose()

		if (classId) {
			await classesSrc.update(classId, form.values)
		} else {
			await classesSrc.create(form.values)
		}
	}

	const handleSave = useAsyncAction(
		onSave,
		classId ? 'update' : 'create',
		form.values.name ?? 'New Class'
	)

	return (
		<Modal
			opened
			onClose={onClose ?? (() => {})}
			title={<Title order={3}>{classData?.name || 'New Class'}</Title>}
		>
			<LoadingOverlay visible={loading} radius='sm' />
			<TextInput label='Name' {...form.getInputProps('name')} />

			<MultiSelect
				label='Memberships'
				data={membershipOptions}
				{...form.getInputProps('memberships')}
			/>

			<ClassScheduleInput {...form.getInputProps('schedule')} />

			<ModalActions
				primaryAction={handleSave}
				primaryLabel='Save'
				secondaryAction={onClose}
				secondaryLabel='Cancel'
			/>
		</Modal>
	)
}

export default ClassEditModal
