import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { query } from '../../../../util/db';
import { isResponse, res200, res404, res500, Response } from '../../../../util/res';
import { getSchool, getSchoolAuth } from '../../../../util/school';
import { authUser, getUser, getUserId } from '../../../../util/user';
import { generateSnowflake } from '../../../../util/snowflake';
import stripe from '../../../../util/stripe';
import type { InferType } from 'yup';
import { validator } from '@common/util';
import { validateBody } from '../../../../util/validation';

export type SchoolClassPostBody = InferType<typeof validator.classCreateSchema>;

export const handler = async (event: APIGatewayProxyEvent): Promise<Response> => {
    const body = await validateBody(validator.classCreateSchema, event.body);
    if(isResponse(body))
        return body;

    const user = await authUser(event);
    if(isResponse(user)) return user;

    const school = await getSchool(event);
    if(isResponse(school)) return school;

    const clazz = await query("INSERT INTO classes (id, school, name, schedule) VALUES ($1, $2, $3, $4) RETURNING *", [generateSnowflake(), school.id, body.name, body.schedule]);
    if(!clazz) return res500();

    return res200();
}