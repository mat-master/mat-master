import {
	Button,
	Center,
	Group,
	Paper,
	Stepper,
	Text,
	Title,
	useMantineTheme,
} from '@mantine/core'
import axios from 'axios'
import React, { useState } from 'react'
import { CircleCheck, CreditCard, ShieldLock, User } from 'tabler-icons-react'
import { RemoteSignUpForm } from '../components/sign-up-form'

const SignUpPage: React.FC = () => {
	const theme = useMantineTheme()

	const [activeStep, setStep] = useState(0)
	const step = () => setStep(activeStep + 1)

	return (
		<Center style={{ flexDirection: 'column' }}>
			<Paper
				padding='lg'
				mt='xl'
				mb='sm'
				shadow='sm'
				withBorder
				style={{ width: 512 }}
			>
				<Title mb='lg'>Sign Up</Title>
				<Stepper
					active={activeStep}
					radius='md'
					completedIcon={<CircleCheck />}
					styles={{
						stepIcon: {
							backgroundColor: 'transparent',
							color: theme.colors.gray[3],
							borderColor: theme.colors.gray[3],
						},
						separator: {
							backgroundColor: theme.colors.gray[3],
						},
					}}
				>
					<Stepper.Step
						icon={
							<User color={activeStep === 0 ? theme.primaryColor : undefined} />
						}
					>
						<RemoteSignUpForm submitLabel='Continue' onSubmit={step} />
					</Stepper.Step>

					<Stepper.Step
						icon={
							<ShieldLock
								color={activeStep === 1 ? theme.primaryColor : undefined}
							/>
						}
					>
						<Text color='dimmed' align='center' mb='lg'>
							We sent an email to benbaldwin000@gmail.com. If you don't see it in
							the next couple minutes either check your spam folder or resend the
							email.
						</Text>
						<Group position='right' spacing='lg'>
							<Button
								variant='outline'
								onClick={async () => {
									await axios.post('/users/me/verify')
									step()
								}}
							>
								Resend Email
							</Button>
							<Button onClick={step}>Check Verification</Button>
						</Group>
					</Stepper.Step>

					<Stepper.Step
						icon={
							<CreditCard
								color={activeStep === 2 ? theme.primaryColor : undefined}
							/>
						}
					></Stepper.Step>
				</Stepper>
			</Paper>
		</Center>
	)
}

export default SignUpPage
