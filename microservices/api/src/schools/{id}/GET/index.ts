import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type { Privilege, School, Student, User } from '@common/types';
import { res400, res200, isResponse, res403, Response, res500 } from '../../../util/res';
import { authUser, getUser } from '../../../util/user';
import { query } from '../../../util/db';
import { getSchoolAuth } from '../../../util/school';

export type SchoolGetResponse = School;

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