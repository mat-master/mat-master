import { Button, Group, LoadingOverlay, Text } from '@mantine/core'
import type React from 'react'
import { useState } from 'react'

export type FormProps = JSX.IntrinsicElements['form'] & {
	loading?: boolean
	error?: string
	submitLabel?: string
	canSubmit?: boolean
}

const Form: React.FC<FormProps> = ({
	loading,
	error,
	children,
	onSubmit,
	submitLabel = 'Save',
	canSubmit,
	...props
}) => {
	const [submitting, setSubmitting] = useState(false)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		if (submitting) return
		setSubmitting(true)

		try {
			onSubmit && (await onSubmit(e))
		} finally {
			setSubmitting(false)
		}
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
				<Group position='right'>
					<Button type='submit' loading={submitting} disabled={!canSubmit}>
						{submitLabel}
					</Button>
				</Group>
				{error && <Text color='red'>{error}</Text>}
			</Group>
		</form>
	)
}

export default Form
