import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import type React from 'react'

const publicKey =
	'pk_test_51JetjJGsHxGKM7KBPLMtSBtvx9DrWf1We61NLq9Jxq15a8L0zixNQAG72uyTA8EYEawIwEuJfNeacAd3SbUDgGwi00JC8U6MAI'
// window.location.hostname === 'localhost' ||
// window.location.hostname === '127.0.0.1'
// 	? 'pk_test_51JetjJGsHxGKM7KBPLMtSBtvx9DrWf1We61NLq9Jxq15a8L0zixNQAG72uyTA8EYEawIwEuJfNeacAd3SbUDgGwi00JC8U6MAI'
// 	: 'pk_live_51JetjJGsHxGKM7KBaXFJBt0hJNrn0BZEiAlFnNQi5yMbSKlZFt7h15NUiaNscTmH1vXEOH7EW6Y7OMuU9tP6GQOL00pqcptGHx'

const stripePromise = loadStripe(publicKey)

const StripeProvider: React.FC = ({ children }) => {
	// const { data } = useQuery(`setup-intent-${useId()}`, createSetupIntent)
	// if (!data) return <Loader />

	return (
		<Elements stripe={stripePromise} options={{ clientSecret: '' }}>
			{children}
		</Elements>
	)
}

export default StripeProvider
