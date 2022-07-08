import {
	ActionIcon,
	Group,
	InputWrapper,
	InputWrapperProps,
	Text,
} from '@mantine/core'
import { ClassTime } from '@mat-master/common'
import React, { useContext, useState } from 'react'
import {
	CircleMinus as RemoveIcon,
	CirclePlus as CreateIcon,
} from 'tabler-icons-react'
import { getEnglishSchedule } from '../utils/get-english-schedule'
import ClassTimeForm from './class-time-form'
import { modalsCtx } from './modals-context'

type ClassTimeData = Omit<ClassTime, 'id' | 'classId'>
type ClassScheduleInputValue = ClassTimeData[]

type BaseClassInputProps = {
	value?: ClassScheduleInputValue
	defaultValue?: ClassScheduleInputValue
	onChange?: (value: ClassScheduleInputValue) => void
}

export type ClassScheduleInputProps = BaseClassInputProps &
	Omit<InputWrapperProps, keyof BaseClassInputProps | 'children'>

const ClassScheduleInput = React.forwardRef<
	HTMLDivElement,
	ClassScheduleInputProps
>(({ value: controlledValue, defaultValue = [], onChange }, ref) => {
	const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue)
	const value = controlledValue ?? uncontrolledValue

	const createTime = (time: ClassTimeData) => {
		const newValue = [...value, time]
		setUncontrolledValue(newValue)
		if (onChange) onChange(newValue)
	}

	const removeTime = (i: number) => {
		const newValue = [...value]
		newValue.splice(i, 1)
		setUncontrolledValue(newValue)
		if (onChange) onChange(newValue)
	}

	const modals = useContext(modalsCtx)
	const openCreateForm = () =>
		modals.push({
			title: 'New Class Time',
			children: (
				<ClassTimeForm
					onSubmit={(value) => {
						createTime(value)
						modals.pop()
					}}
				/>
			),
		})

	return (
		<InputWrapper ref={ref}>
			<ul style={{ padding: 0, margin: 0, listStyleType: 'none' }}>
				{value.map((time, i) => (
					<li key={i}>
						<Group
							spacing='xs'
							style={{
								display: 'inline-flex',
								width: '100%',
							}}
						>
							<ActionIcon
								key='delete'
								variant='hover'
								color='red'
								onClick={() => removeTime(i)}
							>
								<RemoveIcon size={18} />
							</ActionIcon>
							<Text style={{ marginRight: 'auto' }}>
								{getEnglishSchedule(time)}
							</Text>
						</Group>
					</li>
				))}

				<li>
					<Group spacing='xs'>
						<ActionIcon variant='hover' onClick={openCreateForm}>
							<CreateIcon size={18} />
						</ActionIcon>
						<Text color='dimmed'>New Class Time</Text>
					</Group>
				</li>
			</ul>
		</InputWrapper>
	)
})

export default ClassScheduleInput
