import { ActionIcon, Box, createStyles, Group, InputWrapper } from '@mantine/core';
import type React from 'react';
import { useEffect, useState } from 'react';
import { MinusCircle, PlusCircle } from 'react-feather';
import type { ClassTime } from '../utils/class-time-serialization';
import randomString from '../utils/random-string';
import ClassTimeInput from './class-time-input';

export interface ClassScheduleInputProps {
	initialValue?: ClassTime[];
	onChange: (value: ClassTime[]) => void;
}

const useStyles = createStyles((theme) => ({
	timeInput: {
		display: 'grid',
		gridTemplateColumns: 'min-content 1fr',
		columnGap: theme.spacing.sm,
		alignItems: 'center',
	},
}));

const ClassScheduleInput: React.FC<ClassScheduleInputProps> = ({ initialValue, onChange }) => {
	const { classes } = useStyles();
	const [times, setTimes] = useState<Array<{ key: string; time: ClassTime | null }>>([]);

	useEffect(() => {
		if (!initialValue) return setTimes([{ key: randomString(6), time: null }]);
		setTimes(initialValue.map((time) => ({ key: randomString(6), time })));
	}, []);

	const handleChange = (i: number, value: ClassTime | null) => {
		const newTimes = [...times];

		newTimes[i].time = value;
		if (value === null) newTimes.splice(i, 1);

		setTimes(newTimes);
		onChange(
			newTimes
				.filter(({ time }) => typeof time === 'string')
				.map(({ time }) => time) as ClassTime[]
		);
	};

	return (
		<InputWrapper label='Schedule'>
			<Group direction='column' spacing='sm'>
				{times.map(({ key, time }, i) => (
					<Box key={key} className={classes.timeInput}>
						<ActionIcon disabled={times.length <= 1} onClick={() => handleChange(i, null)}>
							<MinusCircle size={16} />
						</ActionIcon>

						<ClassTimeInput
							initialValue={time ?? undefined}
							onChange={(value) => handleChange(i, value)}
						/>
					</Box>
				))}

				<ActionIcon
					onClick={() => setTimes([...times, { key: randomString(6), time: null }])}
					disabled={!times[times.length - 1]?.time}
				>
					<PlusCircle size={16} />
				</ActionIcon>
			</Group>
		</InputWrapper>
	);
};

export default ClassScheduleInput;
