import { PrismaClient } from '@prisma/client'
import sgmail from '@sendgrid/mail'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import Stripe from 'stripe'
import { expressHandler } from 'trpc-playground/handlers/express'
import { createContextConstructor, router } from './procedures'

const main = async () => {
	// Load .env into process.env
	dotenv.config({ path: path.resolve(process.cwd(), '.env.dev') })
	dotenv.config({ override: true }) // Override dev env variables with production ones

	const app = express()
	const db = new PrismaClient()
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
		apiVersion: '2020-08-27',
	})

	await db.$connect()
	sgmail.setApiKey(process.env.SENDGRID_API_KEY!)

	app.use(cors())

	app.use(
		'/trpc',
		createExpressMiddleware({
			router,
			createContext: createContextConstructor({
				db,
				stripe,
				env: {
					JWT_SECRET: process.env.JWT_SECRET!,
				},
			}),
		})
	)

	if (process.env.NODE_ENV !== 'prod') {
		app.use(
			'/playground',
			await expressHandler({
				router,
				trpcApiEndpoint: '/trpc',
				playgroundEndpoint: '/playground',
				request: {
					superjson: true,
				},
			})
		)
	}

	const port = parseInt(process.env.PORT || '') || 8080
	app.listen(port, () => console.log(`API listening on port ${port}`))
}

main()
