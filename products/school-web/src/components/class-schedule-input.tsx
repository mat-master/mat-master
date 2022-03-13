import type { ClassTime } from '@common/types'
import {
	ActionIcon,
	createStyles,
	Group,
	InputWrapper,
	InputWrapperBaseProps,
} from '@mantine/core'
import { randomId } from '@mantine/hooks'
import React, { useState } from 'react'
import { CircleMinus as RemoveIcon, CirclePlus as AddIcon } from 'tabler-icons-react'
import ClassTimeInput, { defaultClassTime } from './class-time-input'

export interface ClassScheduleInputProps extends InputWrapperBaseProps {
	value?: Array<ClassTime>
	onChange?: (value: Array<ClassTime>) => void
}

type ClassScheduleInputState = Array<{ key: string; time: ClassTime }>

const useStyles = createStyles((theme) => ({
	timeInput: {
		display: 'grid',
		gridTemplateColumns: 'min-content 1fr',
		columnGap: theme.spacing.sm,
		alignItems: 'center',
	},
}))

const ClassScheduleInput = React.forwardRef<HTMLDivElement, ClassScheduleInputProps>(
	({ value: controlledValue, onChange, ...props }, ref) => {
		const { classes } = useStyles()
		const controlledState = controlledValue?.map((time) => ({ key: randomId(), time }))
		const [uncontrolledState, setUncontrolledState] = useState<ClassScheduleInputState>(
			controlledState ?? [{ key: randomId(), time: defaultClassTime }]
		)
		const state = controlledState ?? uncontrolledState

		const handleChange = (newValue: ClassScheduleInputState) => {
			setUncontrolledState(newValue)
			onChange && onChange(newValue.map(({ time }) => time))
		}

		const addTime = () => handleChange([...state, { key: randomId(), time: defaultClassTime }])

		const updateTime = (i: number, time: ClassTime) => {
			const newValue = [...state]
			if (newValue[i]) newValue[i].time = time
			handleChange(newValue)
		}

		const removeTime = (i: number) => {
			const newValue = [...state]
			newValue.splice(i, 1)
			handleChange(newValue)
		}

		return (
			<InputWrapper {...props} onChange={undefined} ref={ref}>
				<Group direction='column' spacing='sm'>
					{state.map(({ key, time }, i) => (
						<div key={key} className={classes.timeInput}>
							<ActionIcon disabled={state.length <= 1} onClick={() => removeTime(i)}>
								<RemoveIcon size={16} />
							</ActionIcon>
							<ClassTimeInput value={time} onChange={(value) => updateTime(i, value)} />
						</div>
					))}

					<ActionIcon onClick={addTime}>
						<AddIcon size={16} />
					</ActionIcon>
				</Group>
			</InputWrapper>
		)
	}
)

export default ClassScheduleInput
