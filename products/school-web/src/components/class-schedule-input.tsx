import { ActionIcon, Box, createStyles, Group, InputWrapper } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import type React from 'react';
import { useState } from 'react';
import { MinusCircle, PlusCircle } from 'react-feather';
import ClassTimeInput, { ClassTime } from './class-time-input';

export interface ClassScheduleInputProps {
	value?: Array<ClassTime | null>;
	onChange?: (value: Array<ClassTime | null>) => void;
}

const useStyles = createStyles((theme) => ({
	timeInput: {
		display: 'grid',
		gridTemplateColumns: 'min-content 1fr',
		columnGap: theme.spacing.sm,
		alignItems: 'center',
	},
}));

const ClassScheduleInput: React.FC<ClassScheduleInputProps> = ({
	value: controlledValue,
	onChange,
}) => {
	const { classes } = useStyles();
	const [uncontrolledValue, setUncontrolledValue] = useState<
		Array<{ key: string; time: ClassTime | null }>
	>([{ key: randomId(), time: null }]);

	const value = controlledValue
		? controlledValue.map((time) => ({ key: randomId(), time }))
		: uncontrolledValue;

	const handleChange = (newValue: Array<{ key: string; time: ClassTime | null }>) => {
		if (!controlledValue) setUncontrolledValue(newValue);
		onChange && onChange(newValue.map(({ time }) => time));
	};

	const addTime = () => handleChange([...value, { key: randomId(), time: null }]);

	const updateTime = (i: number, time: ClassTime | null) => {
		const newValue = [...value];
		if (newValue[i]) newValue[i].time = time;
		handleChange(newValue);
	};

	const removeTime = (i: number) => {
		const newValue = [...value];
		newValue.splice(i, 1);
		handleChange(newValue);
	};

	return (
		<InputWrapper label='Schedule'>
			<Group direction='column' spacing='sm'>
				{value.map(({ key, time }, i) => (
					<Box key={key} className={classes.timeInput}>
						<ActionIcon disabled={value.length <= 1} onClick={() => removeTime(i)}>
							<MinusCircle size={16} />
						</ActionIcon>

						<ClassTimeInput
							value={time ?? undefined}
							onChange={(value) => updateTime(i, value)}
						/>
					</Box>
				))}

				<ActionIcon onClick={addTime} disabled={!value[value.length - 1]?.time}>
					<PlusCircle size={16} />
				</ActionIcon>
			</Group>
		</InputWrapper>
	);
};

export default ClassScheduleInput;
