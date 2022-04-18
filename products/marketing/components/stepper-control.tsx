import { Button, Group } from '@mantine/core';
import React from 'react';
import { ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon } from 'react-feather';

export interface StepperControlProps {
	steps: number;
	active: number;
	setActive: (active: number) => void;
}

const StepperControl: React.FC<StepperControlProps> = ({ steps, active, setActive }) => {
	return (
		<Group position='apart'>
			<Button
				variant='outline'
				disabled={active <= 0}
				onClick={() => setActive(Math.max(0, active - 1))}
				leftIcon={<ArrowLeftIcon size={18} />}
			>
				Back
			</Button>

			<Button
				onClick={() => setActive(Math.min(steps, active + 1))}
				rightIcon={active < steps && <ArrowRightIcon size={18} />}
			>
				{active < steps ? 'Next' : 'Done'}
			</Button>
		</Group>
	);
};

export default StepperControl;
