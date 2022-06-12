import { PrismaClient } from '@prisma/client'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import express from 'express'
import Stripe from 'stripe'
import { createContextConstructor, router } from './procedures'

const main = async () => {
	const db = new PrismaClient()
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
		apiVersion: '2020-08-27',
	})

	await db.$connect()

	const app = express()
	const trpcMiddleware = createExpressMiddleware({
		router,
		createContext: createContextConstructor({
			db,
			stripe,
			env: {
				JWT_SECRET: process.env.JWT_SECRET!,
			},
		}),
		onError({ error }) {
			console.log(error)
		},
	})

	app.use('/', trpcMiddleware)
	app.listen(8080, () => console.log('User api listening on port 8080'))

	await db.$disconnect()
}

main()
