import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type { Privilege, Student, User } from '@common/types';
import { res400, res200, isResponse, res403, Response, res500 } from '../../../../util/res';
import { authUser, getUser } from '../../../../util/user';
import { query } from '../../../../util/db';
import { getSchoolAuth } from '../../../../util/school';
import type { SchoolInvitesGetResponse } from '@common/types';

export const handler = async (event: APIGatewayProxyEvent): Promise<Response> => {
    const user = await authUser(event);
    if(isResponse(user))
        return user;

    const school = await getSchoolAuth(user, event);
    if(isResponse(school))
        return school;

    const invites = await query("SELECT email FROM invites WHERE school = $1", [school.id]);
    if(!invites)
        return res500();

    //Return the invites
    return res200<SchoolInvitesGetResponse>(invites.rows.map(invite => invite.email));
}