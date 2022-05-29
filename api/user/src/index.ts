import { snowflakeSchema } from '@mat-master/common'
import { router } from '@trpc/server'
import { z } from 'zod'

const authRouter = router().query('hello', {
	input: z.object({ id: snowflakeSchema }),
	resolve: (req) => `hello ${req.input.id}`,
})

type AuthRouter = typeof authRouter
export default AuthRouter
