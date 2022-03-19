import type { ClassTime } from '@common/types'
import { classTimeSchema } from '@common/util/src/validator'
import {
	ActionIcon,
	createStyles,
	Group,
	InputWrapper,
	InputWrapperBaseProps,
} from '@mantine/core'
import { randomId, useUncontrolled } from '@mantine/hooks'
import React from 'react'
import { CircleMinus as RemoveIcon, CirclePlus as AddIcon } from 'tabler-icons-react'
import * as yup from 'yup'
import ClassTimeInput, { defaultClassTime } from './class-time-input'
export interface ClassScheduleInputProps extends InputWrapperBaseProps {
	value?: Array<ClassTime>
	defaultValue?: Array<ClassTime>
	onChange?: (value: Array<ClassTime>) => void
}

type ClassScheduleInputState = Array<{ key: string; time: ClassTime }>

const classScheduleInputStateSchema: yup.SchemaOf<ClassScheduleInputState> = yup
	.array()
	.of(yup.object({ key: yup.string().required(), time: classTimeSchema.required() }).required())

const useStyles = createStyles((theme) => ({
	timeInput: {
		display: 'grid',
		gridTemplateColumns: 'min-content 1fr',
		columnGap: theme.spacing.sm,
		alignItems: 'center',
	},
}))

const ClassScheduleInput = React.forwardRef<HTMLDivElement, ClassScheduleInputProps>(
	({ value: controlledValue, onChange, defaultValue, ...props }, ref) => {
		const { classes } = useStyles()

		const [state, setState] = useUncontrolled<ClassScheduleInputState>({
			value: controlledValue?.map((time) => ({ key: randomId(), time })),
			defaultValue: (defaultValue ?? []).map((time) => ({ key: randomId(), time })),
			finalValue: [],
			onChange: (value) => onChange && onChange(value?.map(({ time }) => time) ?? []),
			rule: (value) => !!classScheduleInputStateSchema.nullable().validateSync(value),
		})

		const addTime = () => {
			const _state = state ?? []
			setState([..._state, { key: randomId(), time: defaultClassTime }])
		}

		const updateTime = (i: number, time: ClassTime) => {
			const newValue = state ? [...state] : []
			if (newValue[i]) newValue[i].time = time
			setState(newValue)
		}

		const removeTime = (i: number) => {
			const newValue = state ? [...state] : []
			newValue.splice(i, 1)
			setState(newValue)
		}

		return (
			<InputWrapper {...props} onChange={undefined} ref={ref}>
				<Group direction='column' spacing='sm'>
					{state?.map(({ key, time }, i) => (
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
