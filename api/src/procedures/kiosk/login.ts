import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { Procedure } from '..'
import { db } from '../..'
import { snowflakeSchema } from '../../models'
import { KioskPayload } from '../../models/kiosk-payload'

export const kioskLoginParams = z.object({
	schoolId: snowflakeSchema,
	pin: z.string(),
})

export type KioskLoginParams = z.infer<typeof kioskLoginParams>
export interface KioskLoginResult {
	jwt: string
}

export const login: Procedure<KioskLoginParams, KioskLoginResult> = async ({
	input: { schoolId, pin },
}) => {
	const result = await db.kiosk.findFirst({ where: { schoolId, pin } })
	if (!result) throw 'School or pin is incorrect'

	const payload: KioskPayload = {
		id: result.id,
		schoolId,
	}

	return { jwt: jwt.sign(payload, process.env.JWT_SECRET as string) }
}
