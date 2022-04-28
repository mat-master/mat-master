import { Button, Group, LoadingOverlay, Text } from '@mantine/core'
import type React from 'react'
import { useState } from 'react'

export type FormProps = JSX.IntrinsicElements['form'] & {
	loading?: boolean
	error?: string
}

const Form: React.FC<FormProps> = ({
	loading,
	error,
	children,
	onSubmit,
	...props
}) => {
	const [submitting, setSubmitting] = useState(false)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		if (submitting) return
		setSubmitting(true)
		onSubmit && (await onSubmit(e))
		setSubmitting(false)
	}

	return (
		<form
			{...props}
			onSubmit={handleSubmit}
			style={{ ...props.style, position: 'relative' }}
		>
			<LoadingOverlay visible={!!loading} />

			<Group direction='column' spacing='sm' grow>
				{children}
				{error && <Text color='red'>{error}</Text>}
				<Group position='right'>
					<Button type='submit'>Save</Button>
				</Group>
			</Group>
		</form>
	)
}

export default Form
