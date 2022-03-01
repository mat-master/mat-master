import { createStyles, InputWrapper, Select, Text } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import dayjs from 'dayjs';
import weekdayPlugin from 'dayjs/plugin/weekday';
import type React from 'react';
import { useEffect, useState } from 'react';
import {
	ClassTime,
	deserializeClassTime,
	serializeClassTime,
} from '../utils/class-time-serialization';

dayjs.extend(weekdayPlugin);

export interface ClassTimeInputProps {
	initialValue?: ClassTime;
	onChange: (value: ClassTime) => void;
}

interface ClassTimeInputState {
	day?: string | null;
	start?: Date;
	end?: Date;
}

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const useStyles = createStyles((theme) => ({
	root: {
		display: 'grid',
		gridTemplateColumns: '1fr min-content max-content min-content',
		columnGap: theme.spacing.sm,
		alignItems: 'center',
	},
}));

const ClassTimeInput: React.FC<ClassTimeInputProps> = ({ initialValue, onChange }) => {
	const { classes } = useStyles();
	const [classTime, setClassTime] = useState<ClassTimeInputState>({});

	useEffect(() => {
		if (!initialValue) return;

		try {
			const [start, end] = deserializeClassTime(initialValue);
			setClassTime({ day: WEEKDAYS[start.getDay()], start, end });
		} catch (error) {
			console.error(`Error deserializing class time ${error}`);
		}
	}, []);

	const handleChange = (value: Partial<ClassTimeInputState>) => {
		const newClassTime = { ...classTime, ...value };
		setClassTime(newClassTime);

		if (typeof newClassTime.day !== 'string') return;
		if (!(newClassTime.start instanceof Date)) return;
		if (!(newClassTime.end instanceof Date)) return;

		const dayIndex = WEEKDAYS.findIndex((item) => item === newClassTime.day);
		const start = dayjs(newClassTime.start).weekday(dayIndex).toDate();
		onChange(serializeClassTime(start, newClassTime.end));
	};

	// const handleStartChange = (value: Date) => {
	// 	const duration = classTime.end && classTime.start
	// 		? Math.max(0, classTime.end.getTime() - classTime.start?.getTime())
	// 		: defaultDuration * 60 * 1000;

	// 	const end = dayjs(value).add(duration, 'ms').toDate();
	// 	handleChange({ start: value, end });
	// };

	// const handleEndChange = (value: Date) => {
	// 	if (value.getTime() < (classTime.start?.getTime() ?? 0)) {
	// 		handleChange({ end: classTime.start });
	// 	} else {
	// 		handleChange({ end: value });
	// 	}
	// };

	return (
		<InputWrapper className={classes.root}>
			<Select data={WEEKDAYS} value={classTime.day} onChange={(day) => handleChange({ day })} />
			<TimeInput
				format='12'
				value={classTime.start}
				onChange={(start) => handleChange({ start })}
			/>
			<Text>-</Text>
			<TimeInput format='12' value={classTime.end} onChange={(end) => handleChange({ end })} />
		</InputWrapper>
	);
};

export default ClassTimeInput;
