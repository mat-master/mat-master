import { snowflakeSchema } from '@mat-master/common'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { Procedure } from '..'
import { KioskPayload } from '../../models/kiosk-payload'
import { signPayload } from '../../util/payload-encoding'

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
	if (!result)
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'incorrect pin',
		})

	const payload: KioskPayload = {
		id: result.id,
		schoolId,
	}

	return { jwt: signPayload(payload) }
}
