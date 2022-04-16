import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type { Privilege, Student, User } from '@common/types';
import { res400, res200, isResponse, res403, Response, res500 } from '../../../../util/res';
import { authUser, getUser } from '../../../../util/user';
import { query } from '../../../../util/db';
import { getSchoolAuth } from '../../../../util/school';
import type { SchoolStudentsGetResponse } from '@common/types';

export const handler = async (event: APIGatewayProxyEvent): Promise<Response> => {
    const user = await authUser(event);
    if(isResponse(user))
        return user;

    const school = await getSchoolAuth(user, event);
    if(isResponse(school))
        return school;

    const students = await query("SELECT * FROM students INNER JOIN users ON students.\"user\" = users.id WHERE students.school = $1", [school.id]);
    if(!students)
        return res500();

    //Return the students
    return res200<SchoolStudentsGetResponse>(students.rows.map(student => ({
            id: student.id,
            user: {
                id: student.user,
                firstName: student.first_name,
                lastName: student.last_name,
                email: student.email,
                privilege: student.privilege
            },
            stripeCustomerId: student.stripeCustomerId
    })));
}