import { db } from '..'
import { Snowflake } from '../models'
import { Context } from '../procedures'
import { privateErrors } from './private-errors'
import { useAuthentication } from './use-authentication'

export const useSchoolAuthentication = async (ctx: Context, id: Snowflake) => {
	const payload = useAuthentication(ctx)
	const school = await privateErrors(() => db.school.findUnique({ where: { id } }))

	if (!school) throw 'School not found'
	if (payload.id !== school.ownerId) throw "You aren't the owner of this school"

	return { payload, school }
}
