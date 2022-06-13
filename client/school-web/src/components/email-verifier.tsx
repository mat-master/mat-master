import { Button, Group, Text } from '@mantine/core'
import type React from 'react'
import { useEffect } from 'react'
import { trpc } from '../utils/trpc'

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
		data: me,
		isLoading: meLoading,
		refetch: refetchMe,
	} = trpc.useQuery(['user.get'])

	useEffect(() => {
		if (me?.emailVerified && onVerified) onVerified()
	}, [me?.emailVerified])

	const { isLoading: sendingEmail, mutate: sendEmail } = trpc.useMutation(
		['auth.resendVerificationEmail'],
		{ onSuccess: onSent }
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
					onClick={() => sendEmail()}
					loading={sendingEmail}
				>
					Resend Email
				</Button>

				<Button onClick={() => refetchMe()} loading={meLoading}>
					Check Verification
				</Button>
			</Group>
		</div>
	)
}

export default EmailVerifier
