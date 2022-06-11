import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { Procedure } from '..'
import { snowflakeSchema } from '../../models'
import { KioskPayload } from '../../models/kiosk-payload'

export const loginKioskParams = z.object({
	schoolId: snowflakeSchema,
	pin: z.string(),
})

export type LoginKioskParams = z.infer<typeof loginKioskParams>
export interface LoginKioskResult {
	jwt: string
}

export const loginKiosk: Procedure<LoginKioskParams, LoginKioskResult> = async ({
	ctx,
	input: { schoolId, pin },
}) => {
	const result = await ctx.db.kiosk.findFirst({ where: { schoolId, pin } })
	if (!result) throw 'School or pin is incorrect'

	const payload: KioskPayload = {
		id: result.id,
		schoolId,
	}

	return { jwt: jwt.sign(payload, process.env.JWT_SECRET as string) }
}
