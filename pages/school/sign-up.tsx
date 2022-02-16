import {
	Button,
	Center,
	Container,
	createStyles,
	Group,
	Paper,
	Stepper,
	Title,
	useMantineTheme,
} from '@mantine/core';
import { NextPage } from 'next';
import { useState } from 'react';
import {
	ArrowLeft as ArrowLeftIcon,
	ArrowRight as ArrowRightIcon,
	Check as CheckIcon,
	CreditCard as CreditCardIcon,
	Home as HomeIcon,
	User as UserIcon,
} from 'react-feather';
import AdminSignUpForm from '../../components/admin-sign-up-form';
import BillingSignUpForm from '../../components/billing-sign-up-form';
import SchoolSignUpForm from '../../components/school-sign-up-form';

const useStyles = createStyles(() => ({
	stepIcon: { backgroundColor: 'transparent' },
}));

const SignUpPage: NextPage = () => {
	const [active, setActive] = useState(0);
	const { classes } = useStyles();
	const theme = useMantineTheme();

	return (
		<Center sx={{ flexDirection: 'column', width: '100vw', height: '100vh' }}>
			<Container size='sm'>
				<Title mb='sm'>Sign Up</Title>
				<Paper shadow='sm' padding='lg' sx={{ width: theme.breakpoints.sm }}>
					<Stepper
						size='sm'
						active={active}
						onStepClick={setActive}
						completedIcon={<CheckIcon size={18} />}
						classNames={classes}
						mb='md'
					>
						<Stepper.Step
							label={'Admin'}
							description={'Create an account'}
							allowStepSelect={active > 0}
							icon={
								<UserIcon
									size={18}
									color={active === 0 ? theme.primaryColor : theme.colors.gray[3]}
								/>
							}
						>
							<AdminSignUpForm />
						</Stepper.Step>
						<Stepper.Step
							label={'School'}
							description={'Create a school'}
							allowStepSelect={active > 1}
							icon={
								<HomeIcon
									size={18}
									color={active === 1 ? theme.primaryColor : theme.colors.gray[3]}
								/>
							}
						>
							<SchoolSignUpForm />
						</Stepper.Step>
						<Stepper.Step
							label='Billing'
							description='Add billing information'
							allowStepSelect={active > 2}
							icon={
								<CreditCardIcon
									size={18}
									color={active === 2 ? theme.primaryColor : theme.colors.gray[3]}
								/>
							}
						>
							<BillingSignUpForm />
						</Stepper.Step>
					</Stepper>

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
							onClick={() => setActive(active + 1)}
							rightIcon={active < 3 && <ArrowRightIcon size={18} />}
						>
							{active < 3 ? 'Next' : 'Done'}
						</Button>
					</Group>
				</Paper>
			</Container>
		</Center>
	);
};

export default SignUpPage;
