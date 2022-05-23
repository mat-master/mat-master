import { validator } from '@common/util'
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { query } from '../../../../util/db'
import { sendInvite } from '../../../../util/mail'
import { isResponse, res200, res500 } from '../../../../util/res'
import { getSchoolAuth } from '../../../../util/school'
import { authUser } from '../../../../util/user'
import { validateBody } from '../../../../util/validation'

export const handler = async (
	event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
	const body = await validateBody(validator.api.schoolInvitesPostSchema, event.body)
	if (isResponse(body)) return body

	const user = await authUser(event)
	if (isResponse(user)) return user

	const school = await getSchoolAuth(user, event)
	if (isResponse(school)) return school

	const res = await query(
		'INSERT INTO invites (school, email) VALUES ($1, $2) ON CONFLICT DO NOTHING;',
		[school.id, body.email]
	)
	if (!res) return res500('Internal server error trying to send invite')

	await sendInvite(body.email, school)

	return res200()
}
