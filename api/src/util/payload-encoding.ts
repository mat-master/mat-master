import { sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken'
import { deserialize, serialize } from 'superjson'
import { bigint } from 'zod'
import { KioskPayload, Payload, VerificationPayload } from '../models'

type AnyPayload = Payload | VerificationPayload | KioskPayload

type EncodedBigInts<T extends {}> = {
	[K in keyof T]: T[K] extends {}
		? EncodedBigInts<T[K]>
		: T[K] extends bigint
		? string
		: T[K]
}

const encodeBigInts = <T extends {}>(obj: T): EncodedBigInts<T> =>
	Object.fromEntries(
		Object.entries(obj).map(([key, value]) => {
			if (!value) return [key, value]
			if (typeof value === 'object') return [key, encodeBigInts(value)]
			if (typeof value === 'bigint') return [key, bigint.toString()]
			return [key, value]
		})
	) as EncodedBigInts<T>

type DecodedBigInts<T extends {}> = {
	[K in keyof T]: T[K] extends {}
		? DecodedBigInts<T[K]>
		: T[K] extends string
		? string | bigint
		: T[K]
}

const decodeBigInts = <T extends {}>(obj: T) =>
	Object.fromEntries(
		Object.entries(obj).map(([key, value]) => {
			try {
				return [key, BigInt(value as any)]
			} catch {
				return [key, value]
			}
		})
	) as DecodedBigInts<T>

export const signPayload = (payload: AnyPayload, options?: SignOptions) =>
	sign(serialize(payload), process.env.JWT_SECRET!, options)

export const decodeToken = (token: string, options?: VerifyOptions) => {
	const payload = verify(token, process.env.JWT_SECRET!)
	try {
		return deserialize(payload as any)
	} catch {
		return payload
	}
}
