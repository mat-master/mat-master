import {
	ActionIcon,
	Box,
	createStyles,
	Group,
	InputWrapper,
	Select,
	Text,
} from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useListState } from '@mantine/hooks';
import type React from 'react';
import { MinusCircle, PlusCircle } from 'react-feather';

type Segment = '*' | number;
type Crontab = `${Segment} ${Segment} * * ${Segment}`;
type ClassTime = { start: Crontab; end: Crontab };

export interface ClassScheduleInputProps {}

const useStyles = createStyles((theme) => ({
	scheduleItem: {
		display: 'grid',
		gridTemplateColumns: 'min-content 1fr min-content max-content min-content',
		columnGap: theme.spacing.sm,
		alignItems: 'center',
	},
}));

const ClassScheduleInput: React.FC<ClassScheduleInputProps> = ({}) => {
	const [times, timeHandlers] = useListState([null]);
	const { classes } = useStyles();

	return (
		<InputWrapper label='Schedule'>
			<Group direction='column' spacing='xs'>
				{times.map((_, i) => (
					<Box className={classes.scheduleItem}>
						<ActionIcon onClick={() => timeHandlers.remove(i)} disabled={times.length < 2}>
							<MinusCircle size={16} />
						</ActionIcon>
						<Select
							data={[
								'Sunday',
								'Monday',
								'Tuesday',
								'Wednesday',
								'Thursday',
								'Friday',
								'Saturday',
							]}
						/>
						<TimeInput format='12' />
						<Text>-</Text>
						<TimeInput format='12' />
					</Box>
				))}

				<ActionIcon onClick={() => timeHandlers.append(null)}>
					<PlusCircle size={16} />
				</ActionIcon>
			</Group>
		</InputWrapper>
	);
};

export default ClassScheduleInput;
