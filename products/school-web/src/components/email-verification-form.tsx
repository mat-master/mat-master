import { Button, Group, Text } from '@mantine/core'
import type React from 'react'
import { useMutation } from 'react-query'
import { sendVerificationEmail, verifyEmail } from '../data/auth'

export interface EmailVerificationFormProps {
	onVerified?: VoidFunction
	onSent?: VoidFunction
}

const EmailVerificationForm: React.FC<EmailVerificationFormProps> = ({
	onVerified,
	onSent,
}) => {
	const { isLoading: verifying, mutateAsync: verify } = useMutation(
		'verified',
		async () => {
			await verifyEmail()
			onVerified && (await onVerified())
		}
	)

	const { isLoading: sendingEmail, mutateAsync: sendEmail } = useMutation(
		'verification-email',
		async () => {
			await sendVerificationEmail()
			onSent && (await onSent())
		}
	)

	return (
		<div>
			<Text color='dimmed' align='center' mb='lg'>
				We sent an email to benbaldwin000@gmail.com. If you don't see it in the next
				couple minutes either check your spam folder or resend the email.
			</Text>
			<Group position='right' spacing='lg'>
				<Button
					variant='outline'
					onClick={async () => {
						await sendEmail()
						onSent && onSent()
					}}
					loading={sendingEmail}
				>
					Resend Email
				</Button>

				<Button onClick={() => verify()} loading={verifying}>
					Check Verification
				</Button>
			</Group>
		</div>
	)
}

export default EmailVerificationForm
