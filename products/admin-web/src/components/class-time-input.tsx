import { ActionIcon, Box, createStyles, Select, Text } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import dayjs from 'dayjs';
import weekdayPlugin from 'dayjs/plugin/weekday';
import type React from 'react';
import { useEffect, useState } from 'react';
import { MinusCircle } from 'react-feather';
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
	scheduleItem: {
		display: 'grid',
		gridTemplateColumns: 'min-content 1fr min-content max-content min-content',
		columnGap: theme.spacing.sm,
		alignItems: 'center',
	},
}));

const ClassTimeInput: React.FC<ClassTimeInputProps> = ({ initialValue, onChange }) => {
	const { classes } = useStyles();
	const [classTime, setClassTime] = useState<ClassTimeInputState>({});

	useEffect(() => {
		try {
			if (!initialValue) return;
			const [start, end] = deserializeClassTime(initialValue);
			setClassTime({ day: WEEKDAYS[start.getDay()], start, end });
		} catch (error) {
			console.error(error);
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
		const classTimeStr = serializeClassTime(start, newClassTime.end);
		onChange(classTimeStr);
	};

	return (
		<Box className={classes.scheduleItem}>
			<ActionIcon>
				<MinusCircle size={16} />
			</ActionIcon>

			<Select data={WEEKDAYS} value={classTime.day} onChange={(day) => handleChange({ day })} />

			<TimeInput
				format='12'
				value={classTime.start}
				onChange={(start) => handleChange({ start })}
			/>
			<Text>-</Text>
			<TimeInput format='12' value={classTime.end} onChange={(end) => handleChange({ end })} />
		</Box>
	);
};

export default ClassTimeInput;
