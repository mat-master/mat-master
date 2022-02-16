import { Button, Group, GroupProps } from '@mantine/core';
import React from 'react';

export type StepperControlProps = GroupProps & {
	items: number;
	active: number;
	setActive: (i: number) => void;
};

const StepperControl: React.FC<StepperControlProps> = (props) => {
	const { items, active, setActive } = props;

	return (
		<Group position='apart' {...props}>
			<Button
				variant='outline'
				disabled={active <= 0}
				onClick={() => setActive(Math.max(0, active - 1))}
			>
				Back
			</Button>

			<Button onClick={() => setActive(Math.min(items, active + 1))}>
				{active < items ? 'Next' : 'Done'}
			</Button>
		</Group>
	);
};

export default StepperControl;
