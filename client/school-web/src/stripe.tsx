import { Loader } from '@mantine/core'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import type React from 'react'
import { useEffect, useMemo } from 'react'
import { trpc } from './utils/trpc'

const publicKey =
	window.location.hostname === 'localhost'
		? 'pk_test_51JetjJGsHxGKM7KBPLMtSBtvx9DrWf1We61NLq9Jxq15a8L0zixNQAG72uyTA8EYEawIwEuJfNeacAd3SbUDgGwi00JC8U6MAI'
		: 'pk_live_51JetjJGsHxGKM7KBaXFJBt0hJNrn0BZEiAlFnNQi5yMbSKlZFt7h15NUiaNscTmH1vXEOH7EW6Y7OMuU9tP6GQOL00pqcptGHx'

const StripeProvider: React.FC = ({ children }) => {
	const stripePromise = useMemo(() => loadStripe(publicKey), [publicKey])
	const { data, mutate } = trpc.useMutation('user.billing.setup')
	useEffect(mutate, [])

	if (!data) return <Loader />

	return (
		<Elements stripe={stripePromise} options={{ clientSecret: data.secret }}>
			{children}
		</Elements>
	)
}

export default StripeProvider
