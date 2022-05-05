import { loadStripe } from '@stripe/stripe-js'

const publicKey =
	'pk_test_51JetjJGsHxGKM7KBPLMtSBtvx9DrWf1We61NLq9Jxq15a8L0zixNQAG72uyTA8EYEawIwEuJfNeacAd3SbUDgGwi00JC8U6MAI'
// window.location.hostname === 'localhost' ||
// window.location.hostname === '127.0.0.1'
// 	? 'pk_test_51JetjJGsHxGKM7KBPLMtSBtvx9DrWf1We61NLq9Jxq15a8L0zixNQAG72uyTA8EYEawIwEuJfNeacAd3SbUDgGwi00JC8U6MAI'
// 	: 'pk_live_51JetjJGsHxGKM7KBaXFJBt0hJNrn0BZEiAlFnNQi5yMbSKlZFt7h15NUiaNscTmH1vXEOH7EW6Y7OMuU9tP6GQOL00pqcptGHx'

const stripePromise = loadStripe(publicKey)

export default stripePromise
