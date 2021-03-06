import { Button, Group, Text } from '@mantine/core'
import type React from 'react'
import { useEffect } from 'react'
import { useMutation, useQuery } from 'react-query'
import { checkEmailVerification, sendVerificationEmail } from '../data/auth'

export interface EmailVerificationFormProps {
	email: string
	onVerified?: VoidFunction
	onSent?: VoidFunction
}

const EmailVerifier: React.FC<EmailVerificationFormProps> = ({
	email,
	onVerified,
	onSent,
}) => {
	const {
		data: verified,
		isLoading: verifying,
		refetch: checkVerification,
	} = useQuery('email verified', checkEmailVerification)

	useEffect(() => {
		if (verified && onVerified) onVerified()
	}, [verified])

	const { isLoading: sendingEmail, mutateAsync: sendEmail } = useMutation(
		'send verification email',
		async () => {
			await sendVerificationEmail()
			onSent && (await onSent())
		}
	)

	return (
		<div>
			<Text color='dimmed' align='center' mb='lg'>
				We sent an email to {email}. If you don't see it in the next couple minutes
				either check your spam folder or resend the email.
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

				<Button onClick={() => checkVerification()} loading={verifying}>
					Check Verification
				</Button>
			</Group>
		</div>
	)
}

export default EmailVerifier
