import { Button, Center, Group, Text, Title } from '@mantine/core'
import type React from 'react'
import { useEffect } from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { Loader, Refresh as RetryIcon } from 'tabler-icons-react'
import { signout, verifyEmail } from '../data/auth'
import Page from '../page'
import getErrorMessage from '../utils/get-error-message'

const VerifyPage: React.FC = () => {
	const navigate = useNavigate()
	const [query] = useSearchParams()
	const token = query.get('token')

	const { mutate, isLoading, isError, error } = useMutation(
		'email verification',
		verifyEmail,
		{ onSuccess: () => signout(navigate) }
	)

	useEffect(() => mutate(token), [token])

	return (
		<Page>
			<Center>
				<Group direction='column' align='center'>
					<Title order={2}>Validate Email</Title>
					{isLoading && <Loader />}
					{isError && (
						<>
							<Text align='center'>
								Something went wrong while validating your email:
								<br />
								{getErrorMessage(error)}
							</Text>
							<Button leftIcon={<RetryIcon />} onClick={() => mutate(token)}>
								Retry
							</Button>
						</>
					)}
				</Group>
			</Center>
		</Page>
	)
}

export default VerifyPage
