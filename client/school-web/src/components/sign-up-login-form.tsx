import { Anchor, Space, Text } from '@mantine/core'
import { useUncontrolled } from '@mantine/hooks'
import type React from 'react'
import { RemoteSignInForm, RemoteSignInFormProps } from './sign-in-form'
import { RemoteSignUpForm, RemoteSignUpFormProps } from './sign-up-form'

type AuthIntention = 'Sign up' | 'Sign in'
type FormProps = RemoteSignInFormProps & RemoteSignUpFormProps
export interface SignUpLoginFormProps extends FormProps {
	intention?: AuthIntention
	onIntentionChange?(_: AuthIntention): void
}

const SignUpLoginForm: React.FC<SignUpLoginFormProps> = ({
	intention: controlledIntention,
	onIntentionChange = () => {},
	...props
}) => {
	const [intention, setIntention] = useUncontrolled<AuthIntention>({
		value: controlledIntention,
		defaultValue: 'Sign up',
		finalValue: 'Sign up',
		rule: (value) => !!value,
		onChange: onIntentionChange,
	})
	const oppositeIntention: AuthIntention =
		intention === 'Sign in' ? 'Sign up' : 'Sign in'

	const formProps: FormProps = {
		...props,
		style: {
			minWidth: '300px',
		},
	}

	return (
		<div>
			{intention === 'Sign in' ? (
				<RemoteSignInForm {...formProps} />
			) : (
				<RemoteSignUpForm {...formProps} />
			)}
			<Space h='md' />
			<Text color='dimmed' align='center'>
				{intention === 'Sign in' ? "Don't" : 'Already'} have an account?{' '}
				<Anchor onClick={() => setIntention(oppositeIntention)}>
					{oppositeIntention}
				</Anchor>
			</Text>
		</div>
	)
}

export default SignUpLoginForm
