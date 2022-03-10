import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { query } from '../../../../util/db';
import { isResponse, res200, res404, res500, Response } from '../../../../util/res';
import { getSchool, getSchoolAuth } from '../../../../util/school';
import { authUser, getUser, getUserId } from '../../../../util/user';
import { generateSnowflake } from '../../../../util/snowflake';
import { validator } from '@common/util';
import { validateBody } from '../../../../util/validation';

export const handler = async (event: APIGatewayProxyEvent): Promise<Response> => {
    const body = await validateBody(validator.api.schoolMembershipsPostSchema, event.body);
    if(isResponse(body))
        return body;

    const user = await authUser(event);
    if(isResponse(user)) return user;

    const school = await getSchool(event);
    if(isResponse(school)) return school;

    const membershipId = generateSnowflake();
    const membership = await query("INSERT INTO memberships (id, school, name) VALUES ($1, $2, $3) RETURNING *", [membershipId, school.id, body.name]);
    if(!membership) return res500();
    const classesValues = [];
    const classesStatement = [];
    let i = 1;
    for(const classId of body.classes!) {
        classesValues.push(membershipId, classId);
        classesStatement.push(`($${i++}, $${i++})`);
    }
    const classes = await query(`INSERT INTO membership_classes (membership, class) VALUES ${classesStatement.join(", ")}`, classesValues);
    if(!classes) return res500();

    return res200();
}