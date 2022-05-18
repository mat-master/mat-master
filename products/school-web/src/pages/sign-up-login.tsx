import { Center, Paper, Title } from '@mantine/core'
import { useLocalStorageValue } from '@mantine/hooks'
import type React from 'react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SignUpLoginForm from '../components/sign-up-login-form'

export interface SignUpLoginPageProps {
	intention: 'Sign up' | 'Sign in'
}

const SignUpLoginPage: React.FC<SignUpLoginPageProps> = ({ intention }) => {
	const [jwt] = useLocalStorageValue({ key: 'jwt' })
	const navigate = useNavigate()
	const REDIREDCT = '/schools'

	useEffect(() => {
		if (jwt) navigate(REDIREDCT)
	}, [])

	return (
		<Center style={{ flexDirection: 'column' }}>
			<Paper p='lg' mt='xl' mb='sm' shadow='sm' withBorder>
				<Title order={2} mb='sm' style={{ textTransform: 'capitalize' }}>
					{intention}
				</Title>
				<SignUpLoginForm
					intention={intention}
					onIntentionChange={(intention) =>
						navigate(`../${intention.toLowerCase().replace(' ', '-')}`)
					}
					onSubmit={() => navigate(REDIREDCT)}
				/>
			</Paper>
		</Center>
	)
}

export default SignUpLoginPage
