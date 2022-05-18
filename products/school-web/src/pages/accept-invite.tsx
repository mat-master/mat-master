import {
	Anchor,
	Center,
	Paper,
	Stepper,
	StepProps,
	Text,
	Title,
	useMantineTheme,
} from '@mantine/core'
import type React from 'react'
import { useState } from 'react'
import {
	CircleCheck as DoneIcon,
	CreditCard as CreditCardIcon,
	Icon,
	ShieldLock as VerifyIcon,
	User as UserIcon,
} from 'tabler-icons-react'
import BillingForm from '../components/billing-form'
import EmailVerificationForm from '../components/email-verification-form'
import { RemoteSignInForm } from '../components/sign-in-form'
import { RemoteSignUpForm } from '../components/sign-up-form'
import { getPrimaryColor } from '../utils/get-colors'

type AuthIntent = 'Sign up' | 'Sign in'

export interface AcceptInvitePageProps {}

const AcceptInvitePage: React.FC<AcceptInvitePageProps> = ({}) => {
	const [currentStep, setCurrentStep] = useState(2)
	const step = () => setCurrentStep(currentStep + 1)

	const [authIntent, setAuthIntent] = useState<AuthIntent>('Sign up')
	const oppositeAuthIntent: AuthIntent =
		authIntent === 'Sign up' ? 'Sign in' : 'Sign up'

	const theme = useMantineTheme()
	const stepProps = (i: number, label: string, Icon: Icon): StepProps => ({
		icon: <Icon color={currentStep === i ? getPrimaryColor(theme) : undefined} />,
		label: currentStep === i && (
			<Title order={4} style={{ color: getPrimaryColor(theme) }}>
				{label}
			</Title>
		),
	})

	return (
		<Center style={{ flexDirection: 'column' }}>
			<Paper p='lg' mt='xl' mb='sm' shadow='sm' withBorder style={{ width: 512 }}>
				<Title mb='lg'>Accept Invite</Title>
				<Stepper
					active={currentStep}
					radius='md'
					completedIcon={<DoneIcon />}
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
					<Stepper.Step {...stepProps(0, authIntent, UserIcon)}>
						{authIntent === 'Sign up' ? (
							<RemoteSignUpForm onSubmit={step} />
						) : (
							<RemoteSignInForm onSubmit={step} />
						)}

						<Text align='center' color='dimmed' mt='lg'>
							Already have an account?{' '}
							<Anchor onClick={() => setAuthIntent(oppositeAuthIntent)}>
								{oppositeAuthIntent}
							</Anchor>{' '}
							instead
						</Text>
					</Stepper.Step>

					<Stepper.Step {...stepProps(1, 'Verify Email', VerifyIcon)}>
						<EmailVerificationForm onVerified={step} />
					</Stepper.Step>

					<Stepper.Step {...stepProps(2, 'Billing Details', CreditCardIcon)}>
						<BillingForm />
					</Stepper.Step>
				</Stepper>
			</Paper>
		</Center>
	)
}

export default AcceptInvitePage
