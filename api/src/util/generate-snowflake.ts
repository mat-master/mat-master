import { randomBytes } from 'crypto'
import { Snowflake } from '../models/snowflake'
import { getProcessIp } from './get-process-ip'

/** Number of bits allocated towards the timestamp portion */
const TIMESTAMP_BITS = 41
/** Number of bits allocated to the worker id, in this case the private lambda ip */
const WORKER_ID_BITS = 10
/** Number of bits allocated to the random generated number */
const SEQUENCE_BITS = 12
/** The epoch to start timestamps from */
const EPOCH = Date.UTC(2022, 0, 1)

export const generateSnowflake = (): Snowflake | null => {
	const ip = getProcessIp()
	if (!ip) return null
	const parts = ip.split('.')
	// Takes the lower 16 bits of the ipv4 address and converts it to a number
	const lower16 = (parseInt(ip[2]) << 8) | parseInt(ip[3])
	const randomId = randomBytes(8).readBigInt64BE() & BigInt(0x3ff)
	// Forms snowflake from the timestamp, worker id, and random number
	return (
		(BigInt(Date.now() - EPOCH) << BigInt(WORKER_ID_BITS + SEQUENCE_BITS)) |
		(BigInt(lower16) << BigInt(SEQUENCE_BITS)) |
		randomId
	)
}
