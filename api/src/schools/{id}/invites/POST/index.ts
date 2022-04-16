import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { isResponse, res200, res400, res500 } from '../../../../util/res';
import { authUser } from '../../../../util/user';
import { getSchoolAuth } from '../../../../util/school';
import { query } from '../../../../util/db';
import type { InferType } from 'yup';
import { validateBody } from '../../../../util/validation';
import { validator } from '@common/util';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const body = await validateBody(validator.api.schoolInvitesPostSchema, event.body);
    if(isResponse(body))
        return body;
    
    const user = await authUser(event);
    if(isResponse(user))
        return user;

    const school = await getSchoolAuth(user, event);
    if(isResponse(school))
        return school;
    
    const res = await query("INSERT INTO invites (school, email) VALUES ($1, $2) ON CONFLICT DO NOTHING;", [school.id, body.email]);
    if(!res)
        return res500("Internal server error trying to send invite");

    // Send email here

    return res200();
}