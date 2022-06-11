import router from './procedures'

const main = async () => {
	const [{ default: express }, { default: Stripe }, { PrismaClient }] =
		await Promise.all([
			import('express'),
			import('stripe'),
			import('@prisma/client'),
		])

	const db = new PrismaClient()
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
		apiVersion: '2020-08-27',
	})

	try {
		const app = express()

		await db.$connect()
		app.listen(8080, () => console.log('User api listening on port 8080'))
	} catch (error) {
		console.error(error)
	}

	db.$disconnect()
}

if (typeof process !== 'undefined') main()

export * from './models'
export type Router = typeof router
