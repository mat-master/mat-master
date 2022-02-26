import { ActionIcon, Group, InputWrapper } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import type React from 'react';
import { PlusCircle } from 'react-feather';
import ClassTimeInput from './class-time-input';

type ClassTime = `${number}:${number}:${number}${'+' | '-'}${number}:${number}`;

export interface ClassScheduleInputProps {}

const ClassScheduleInput: React.FC<ClassScheduleInputProps> = ({}) => {
	const [times, timeHandlers] = useListState([null]);

	return (
		<InputWrapper label='Schedule'>
			<Group direction='column' spacing='xs'>
				{times.map((_, i) => (
					<ClassTimeInput key={i} onChange={console.log} initialValue='0 18 * * 1 : 60' />
				))}

				<ActionIcon onClick={() => timeHandlers.append(null)}>
					<PlusCircle size={16} />
				</ActionIcon>
			</Group>
		</InputWrapper>
	);
};

export default ClassScheduleInput;
