import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { isResponse, res200, res400, res500 } from '../../../../util/res';
import validator from 'validator';
import { authUser } from '../../../../util/user';
import { getSchoolAuth } from '../../../../util/school';
import { query } from '../../../../util/db';

export interface SchoolInvitePostBody {
    email: string
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if(!event.body) 
        return res400("No body submitted");
    const {email}: SchoolInvitePostBody = JSON.parse(event.body);
    if(!validator.isEmail(email))
        return res400("Invalid email");
    
    const user = await authUser(event);
    if(isResponse(user))
        return user;

    const school = await getSchoolAuth(user.id, event);
    if(isResponse(school))
        return school;
    
    const res = await query("INSERT INTO invites (school, email) VALUES ($1, $2) ON CONFLICT DO NOTHING;", [school.id, email]);
    if(!res)
        return res500("Internal server error trying to send invite");

    // Send email here

    return res200();
}