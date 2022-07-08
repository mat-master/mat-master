import { PrismaClient } from '@prisma/client'
import sgmail from '@sendgrid/mail'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import Stripe from 'stripe'
import { createContextConstructor, router } from './procedures'

const main = async () => {
	// Load .env into process.env
	dotenv.config({ path: path.resolve(process.cwd(), '.env.dev') })
	dotenv.config({ override: true }) // Override dev env variables with production ones

	const db = new PrismaClient()
	await db.$connect()

	sgmail.setApiKey(process.env.SENDGRID_API_KEY!)
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
		apiVersion: '2020-08-27',
	})

	const app = express()
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

	const port = parseInt(process.env.PORT || '') || 8080
	app.listen(port, () => console.log(`API listening on port ${port}`))
}

main()
