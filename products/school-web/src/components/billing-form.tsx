import { Button, Group } from '@mantine/core'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import type React from 'react'
import type { FormEvent } from 'react'
import { useMutation } from 'react-query'
import StripeProvider from '../stripe'

const BillingFormInternals: React.FC = () => {
	const stripe = useStripe()
	const elements = useElements()
	const { mutateAsync } = useMutation('card', async (e: FormEvent) => {
		e.preventDefault()

		if (!elements || !stripe) return
		const { error } = await stripe.confirmSetup({
			elements,
			confirmParams: {
				return_url: window.location.href,
			},
		})

		if (error) console.error(error)
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

interface BillingFormProps {}
const BillingForm: React.FC<BillingFormProps> = ({}) => (
	<StripeProvider>
		<BillingFormInternals />
	</StripeProvider>
)

export default BillingForm
