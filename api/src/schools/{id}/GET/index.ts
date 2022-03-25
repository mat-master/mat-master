import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { res400, res200, isResponse, res403, Response, res500 } from '../../../util/res';
import { authUser, getUser } from '../../../util/user';
import { getSchoolAuth } from '../../../util/school';
import type { SchoolGetResponse } from '@common/types';

export const handler = async (event: APIGatewayProxyEvent): Promise<Response> => {
    const user = await authUser(event);
    if(isResponse(user))
        return user;

    const school = await getSchoolAuth(user, event);
    if(isResponse(school))
        return school;

    //Return the invites
    return res200<SchoolGetResponse>(school);
}