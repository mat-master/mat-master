import { PrismaClient } from '@prisma/client'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import express from 'express'
import Stripe from 'stripe'
import { createContext, router } from './procedures'

export const db = new PrismaClient()
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: '2020-08-27',
})

const main = async () => {
	try {
		await db.$connect()

		const app = express()
		app.use('/', createExpressMiddleware({ router, createContext }))
		app.listen(8080, () => console.log('User api listening on port 8080'))
	} catch (error) {
		console.error(error)
	}

	db.$disconnect()
}

main()

export * from './models'
export { router } from './procedures'

