import { PrismaClient } from '@prisma/client'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import express from 'express'
import Stripe from 'stripe'
import { createContextConstructor, router } from './procedures'

export const defaultDb = new PrismaClient()
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2020-08-27',
})

const main = async () => {
	try {
		await defaultDb.$connect()

		const app = express()
		app.use(
			'/',
			createExpressMiddleware({
				router,
				createContext: createContextConstructor({
					db: defaultDb,
					env: {
						JWT_SECRET: process.env.JWT_SECRET as string,
					},
				}),
			})
		)

		app.listen(8080, () => console.log('User api listening on port 8080'))
	} catch (error) {
		console.error(error)
	}

	defaultDb.$disconnect()
}

main()

export * from './models'
export * from './procedures'

