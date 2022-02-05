import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Heading,
	Input,
	Link,
	Stack,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Card from '../../components/card';
import PasswordInput from '../../components/password-input';

const SignInPage: React.FC = () => {
	const [credentials, setCredentials] = useState({ email: '', password: '' });

	return (
		<Box
			bg={useColorModeValue('gray.50', 'inherit')}
			minH='100vh'
			py='12'
			px={{ base: '4', lg: '8' }}
		>
			<Box maxW='md' mx='auto' my='auto'>
				<Stack spacing={3}>
					<Heading>Sign In</Heading>
					<Card>
						<Stack spacing={3}>
							<FormControl id='email'>
								<FormLabel>Email</FormLabel>
								<Input
									name='email'
									type='email'
									autoComplete='email'
									onBlur={(e) => setCredentials({ ...credentials, email: e.target.value })}
									required
								/>
							</FormControl>
							<PasswordInput
								onBlur={(e) => setCredentials({ ...credentials, password: e.target.value })}
							/>
							<Button isFullWidth onClick={() => console.log(credentials)}>
								Sign In
							</Button>
						</Stack>
					</Card>
					<Text align='center'>
						Don't have an account?{' '}
						<Link color='red.500' as={RouterLink} to='../sign-up'>
							Sign up
						</Link>
					</Text>
				</Stack>
			</Box>
		</Box>
	);
};

export default SignInPage;
