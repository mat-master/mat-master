import { sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken'
import { KioskPayload, Payload, VerificationPayload } from '../models'

type AnyPayload = Payload | VerificationPayload | KioskPayload

const encodeBigInts = <T extends {}>(obj: T) => {
	for (const [key, value] of Object.entries(obj)) {
		if (typeof value === 'bigint') {
			obj[key as keyof T] = value.toString() as any
		} else if (value && typeof value === 'object') {
			encodeBigInts(value)
		}
	}
}

const decodeBigInts = <T extends {}>(obj: T) => {
	for (const [key, value] of Object.entries(obj)) {
		if (typeof value === 'string') {
			try {
				obj[key as keyof T] = BigInt(value) as any
			} catch {}
		} else if (value && typeof value === 'object') {
			decodeBigInts(value)
		}
	}
}

export const signPayload = (_payload: AnyPayload, options?: SignOptions) => {
	const payload = Object.assign({}, _payload)
	encodeBigInts(payload)
	return sign(payload, process.env.JWT_SECRET!, options)
}

export const decodeToken = (token: string, options?: VerifyOptions) => {
	const payload = verify(token, process.env.JWT_SECRET!, options)
	decodeBigInts(payload as any)
	return payload
}
