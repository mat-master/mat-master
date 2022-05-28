import type { SignupPostBody } from '@common/types'
import { Privilege } from '@common/types'
import { validator } from '@common/util'
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as bcrypt from 'bcryptjs'
import * as db from '../../../util/db'
import { sendVerification } from '../../../util/mail'
import prisma from '../../../util/prisma'
import { isResponse, res200, res500, resError } from '../../../util/res'
import { generateSnowflake } from '../../../util/snowflake'
import { validateBody } from '../../../util/validation'

// Signs up a user
export const handler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	const body = await validateBody(validator.api.signupPostSchema, event.body)
	if (isResponse(body)) return body

	const { firstName, lastName, email, password }: SignupPostBody = body

	// Check if email is already in use
	const query = await db.query('SELECT * FROM users WHERE email=$1', [email])
	if (query.rows.length !== 0)
		return resError(201, 'Account already registered with email')

	// Hash and salt password, create new user
	const hashed = await bcrypt.hash(password, 5)
	const snowflake = generateSnowflake()
	if (!snowflake) return res500()
	// db.query("INSERT INTO users (id, first_name, last_name, email, password, privilege) VALUES ($1, $2, $3, $4, $5, $6)", [snowflake, firstName, lastName, email, hashed, Privilege.Unverified]);

	await prisma.users.create({
		data: {
			id: BigInt(snowflake),
			first_name: firstName,
			last_name: lastName,
			email,
			password: hashed,
			privilege: Privilege.Unverified,
		},
	})

	await sendVerification(BigInt(snowflake), email, firstName, lastName)

	return res200()
}
