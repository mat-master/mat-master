import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type { Class, Privilege, Student, User } from '@common/types';
import { res400, res200, isResponse, res403, Response, res500 } from '../../../../util/res';
import { authUser, getUser } from '../../../../util/user';
import { query } from '../../../../util/db';
import { getSchoolAuth } from '../../../../util/school';
import type { SchoolClassesGetResponse } from '@common/types';

export const handler = async (event: APIGatewayProxyEvent): Promise<Response> => {
    const user = await authUser(event);
    if(isResponse(user))
        return user;

    const school = await getSchoolAuth(user, event);
    if(isResponse(school))
        return school;

    const classes = await query("SELECT * FROM classes WHERE classes.school = $1", [school.id]);
    if(!classes)
        return res500();

    //Return the students
    return res200<SchoolClassesGetResponse>(classes.rows.map(clazz => ({
            id: clazz.id,
            school: school.id,
            name: clazz.name,
            schedule: clazz.schedule
    })));
}