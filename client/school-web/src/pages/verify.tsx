import { Button, Center, Group, Loader, Text, Title } from '@mantine/core'
import type React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'
import { Refresh as RetryIcon } from 'tabler-icons-react'
import Page from '../page'
import getErrorMessage from '../utils/get-error-message'
import { trpc } from '../utils/trpc'

const VerifyPage: React.FC = () => {
	const navigate = useNavigate()
	const [query] = useSearchParams()
	const token = query.get('token')

	const { mutate, isLoading, isError, error } = trpc.useMutation('auth.verify')

	useEffect(() => {
		if (!token) return navigate('/')
		mutate({ token })
	}, [token, navigate])

	return (
		<Page>
			<Center>
				<Group direction='column' align='center'>
					<Title order={2}>Validate Email</Title>
					{isLoading && <Loader />}
					{isError && (
						<>
							<Text align='center' color='red'>
								{getErrorMessage(error)}
							</Text>
							<Button
								leftIcon={<RetryIcon />}
								onClick={() => mutate({ token: token! })}
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
