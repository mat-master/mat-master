import {
	Center,
	Container,
	createStyles,
	Paper,
	Space,
	Stepper,
	Text,
	Title,
} from '@mantine/core';
import { NextPage } from 'next';
import { useState } from 'react';
import AdminSignUpForm from '../../components/admin-sign-up-form';
import StepperControl from '../../components/stepper-control';

const useStyles = createStyles(() => ({
	stepIcon: { backgroundColor: 'transparent' },
}));

const SignUpPage: NextPage = () => {
	const [active, setActive] = useState(0);
	const { classes } = useStyles();

	return (
		<Center sx={{ flexDirection: 'column', width: '100vw', height: '100vh' }}>
			<Container size='sm'>
				<Title mb='sm'>Sign Up</Title>
				<Paper shadow='sm' padding='lg'>
					<Stepper
						classNames={{ stepIcon: classes.stepIcon }}
						active={active}
						onStepClick={setActive}
						size='sm'
					>
						<Stepper.Step>
							<AdminSignUpForm />
						</Stepper.Step>
						<Stepper.Step>
							<AdminSignUpForm />
						</Stepper.Step>
						<Stepper.Step>
							<AdminSignUpForm />
						</Stepper.Step>
						<Stepper.Completed>
							<Text>Welcome to Mat Master</Text>
						</Stepper.Completed>
					</Stepper>

					<Space h='sm' />

					<StepperControl items={3} active={active} setActive={setActive} />
				</Paper>
			</Container>
		</Center>
	);
};

export default SignUpPage;
