import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type { Privilege, SchoolStudentsIdGetResponse, Student, User } from '@common/types';
import { res400, res200, isResponse, res403, Response, res500 } from '../../../../../util/res';
import { authUser, getUser } from '../../../../../util/user';
import { query } from '../../../../../util/db';
import { getSchoolAuth } from '../../../../../util/school';
import type { SchoolStudentsGetResponse } from '@common/types';

export const handler = async (event: APIGatewayProxyEvent): Promise<Response> => {
    const user = await authUser(event);
    if(isResponse(user))
        return user;

    const school = await getSchoolAuth(user, event);
    if(isResponse(school))
        return school;

    if(!event.pathParameters || !event.pathParameters.studentId)
        return res400("No student id provided");

    const studentId = event.pathParameters.studentId;

    const student = await query(studentQuery, [school.id, studentId]);
    if(!student || student.rowCount === 0)
        return res500();
    
    
    //Return the students
    return res200<SchoolStudentsIdGetResponse>({
            id: student.rows[0].id,
            user: {
                id: student.rows[0].user,
                firstName: student.rows[0].first_name,
                lastName: student.rows[0].last_name,
                email: student.rows[0].email,
                privilege: student.rows[0].privilege
            },
            memberships: student.rows[0].memberships,
            stripeCustomerId: student.rows[0].stripe_customer_id
    });
}

const studentQuery = `SELECT
students.id AS id,
users.id AS "user",
users.first_name AS first_name,
users.last_name AS last_name,
users.email AS email,
users.privilege AS privilege,
students.stripe_customer_id AS stripe_customer_id,
json_build_array(student_memberships.membership) AS memberships 
FROM students
INNER JOIN users ON students."user" = users.id
LEFT JOIN student_memberships on students.id = student_memberships.student
WHERE students.school = $1 AND students.id = $2 LIMIT 1;
`