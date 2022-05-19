import { Button, Center, Group, Loader, Text, Title } from '@mantine/core'
import type React from 'react'
import { useEffect } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { Refresh as RetryIcon } from 'tabler-icons-react'
import { signout, verifyEmail } from '../data/auth'
import Page from '../page'
import getErrorMessage from '../utils/get-error-message'

const VerifyPage: React.FC = () => {
	const navigate = useNavigate()
	const [query] = useSearchParams()
	const token = query.get('token')
	if (!token) {
		navigate('/sign-up')
		return null
	}

	const queryClient = useQueryClient()
	const { mutateAsync, isLoading, isError, error } = useMutation(
		'verify email',
		verifyEmail,
		{ onSuccess: () => signout({ navigate, queryClient }) }
	)

	useEffect(() => {
		mutateAsync({ token })
	}, [token])

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
							<Button
								leftIcon={<RetryIcon />}
								onClick={() => mutateAsync({ token })}
							>
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
