import { Button, Group } from '@mantine/core'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import type React from 'react'
import type { FormEvent } from 'react'
import { useMutation } from 'react-query'
import StripeProvider from '../stripe'

export interface BillingFormProps {
	redirect: string
	onSubmit?(): void
}

const BillingFormInternals: React.FC<BillingFormProps> = ({
	redirect,
	onSubmit,
}) => {
	const stripe = useStripe()
	const elements = useElements()
	const { mutateAsync } = useMutation('card', async (e: FormEvent) => {
		e.preventDefault()

		if (!elements || !stripe) return
		const { error } = await stripe.confirmSetup({
			elements,
			confirmParams: {
				return_url: redirect,
			},
		})

		if (error) return
		if (onSubmit) await onSubmit()
	})

	return (
		<form onSubmit={mutateAsync}>
			<PaymentElement />
			<Group position='right'>
				<Button type='submit'>Save</Button>
			</Group>
		</form>
	)
}

export const BillingForm: React.FC<BillingFormProps> = (props) => (
	<StripeProvider>
		<BillingFormInternals {...props} />
	</StripeProvider>
)
