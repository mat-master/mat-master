import { PrismaClient } from '@prisma/client'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import express from 'express'
import { router } from './procedures'

export const db = new PrismaClient()

const main = async () => {
	try {
		await db.$connect()

		const app = express()
		app.use('/', createExpressMiddleware({ router }))
		app.listen(8080, () => console.log('User api listening on port 8080'))
	} catch (error) {
		console.error(error)
	}

	db.$disconnect()
}

main()

export * from './models'
export { router } from './procedures'

