import { snowflakeSchema } from '@mat-master/common'
import { PrismaClient } from '@prisma/client'
import { router } from '@trpc/server'
import { createExpressMiddleware } from '@trpc/server/adapters/express'
import express from 'express'
import { z } from 'zod'

const db = new PrismaClient()
const authRouter = router().query('hello', {
	input: z.object({ id: snowflakeSchema }),
	resolve: (req) => `hello ${req.input.id}`,
})

type AuthRouter = typeof authRouter
export default AuthRouter

const app = express()
app.use('/', createExpressMiddleware({ router: authRouter }))

const main = async () => {
	try {
		await db.$connect()
		app.listen(8080, () => console.log('User api listening on port 8080'))
	} catch (error) {
		console.error(error)
	}
}

main()
