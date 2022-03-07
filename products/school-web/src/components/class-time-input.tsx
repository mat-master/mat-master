import { createStyles, InputWrapper, Select } from '@mantine/core';
import { TimeRangeInput } from '@mantine/dates';
import { parseExpression } from 'cron-parser';
import dayjs from 'dayjs';
import weekdayPlugin from 'dayjs/plugin/weekday';
import type React from 'react';
import { useState } from 'react';
import * as yup from 'yup'

dayjs.extend(weekdayPlugin)

export interface ClassTime {
	schedule: string
	duration: number
}

export const classTimeSchema: yup.SchemaOf<ClassTime> = yup.object({
	schedule: yup.string().required('Required'),
	duration: yup.number().integer().positive().required(),
})

export interface ClassTimeInputProps {
	value?: ClassTime;
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
		gridTemplateColumns: '1fr min-content',
		columnGap: theme.spacing.sm,
		alignItems: 'center',
	},
}))

const getState = (value: ClassTime): ClassTimeInputState => {
	const start = parseExpression(value.schedule).next().toDate();
	const end = dayjs(start).add(value.duration, 'minutes').toDate();

	return { day: WEEKDAYS[start.getDay()], start, end };
};

const getValue = (state: ClassTimeInputState): ClassTime | null => {
	if (!state.start || !state.end || !state.day) return null;

	const dayIndex = WEEKDAYS.findIndex((item) => item === state.day);
	if (dayIndex < 0) return null;

	const start = dayjs(state.start).weekday(dayIndex);
	const end = dayjs(state.end).year(start.year()).month(start.month()).date(start.date());

	const schedule = `${start.minute()} ${start.hour()} * * ${start.day()}`;
	const duration = Math.round(end.diff(start, 'milliseconds') / 1000 / 60);

	return { schedule, duration };
};

const ClassTimeInput: React.FC<ClassTimeInputProps> = ({
	value: controlledValue,
	onChange,
}) => {
	const { classes } = useStyles();
	const [uncontrolledState, setUncontrolledState] = useState<ClassTimeInputState>({});
	const state = controlledValue ? getState(controlledValue) : uncontrolledState;

	const handleChange = (data: Partial<ClassTimeInputState>) => {
		const newState = { ...state, ...data };
		if (!controlledValue) setUncontrolledState(newState);

		const value = getValue(newState);
		if (value) onChange(value);
	};

	return (
		<InputWrapper className={classes.root}>
			<Select data={WEEKDAYS} value={state.day} onChange={(day) => handleChange({ day })} />
			<TimeRangeInput
				format='12'
				value={[state.start ?? null, state.end ?? null]}
				onChange={([start, end]) => handleChange({ start, end })}
			/>
		</InputWrapper>
	);
};

export default ClassTimeInput;
