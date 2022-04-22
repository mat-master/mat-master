import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { query } from '../../../../util/db';
import { isResponse, res200, res404, res500, Response } from '../../../../util/res';
import { getSchool, getSchoolAuth } from '../../../../util/school';
import { authUser, getUser, getUserId } from '../../../../util/user';
import { generateSnowflake } from '../../../../util/snowflake';
import { validator } from '@common/util';
import { validateBody } from '../../../../util/validation';

export const handler = async (event: APIGatewayProxyEvent): Promise<Response> => {
    const body = await validateBody(validator.api.schoolClassesPostSchema, event.body);
    if(isResponse(body))
        return body;

    const user = await authUser(event);
    if(isResponse(user)) return user;

    const school = await getSchoolAuth(user, event);
    if(isResponse(school)) return school;

    const clazz = await query("INSERT INTO classes (id, school, name, schedule) VALUES ($1, $2, $3, $4) RETURNING *", [generateSnowflake(), school.id, body.name, body.schedule]);
    if(!clazz) return res500();

    return res200();
}