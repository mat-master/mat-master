import { router } from '@trpc/server'

const authRouter = router()
type AuthRouter = typeof authRouter
export default AuthRouter
