import { PrismaClient } from '@prisma/client'
import express from 'express'
import Stripe from 'stripe'

const main = async () => {
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

console.log('running server side code')
main()
