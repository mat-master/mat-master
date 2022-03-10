import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as bcrypt from 'bcryptjs';
import * as db from '../../../util/db';
import { generateSnowflake, getLambdaIp } from '../../../util/snowflake';
import { isResponse, res200, res400, resError } from '../../../util/res';
import { Privilege } from '@common/types';
import type { SignupPostBody } from '@common/types';
import { validator } from '@common/util';
import { validateBody } from '../../../util/validation';

// Signs up a user
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const body = await validateBody(validator.api.signupPostSchema, event.body);
    if(isResponse(body)) return body;

    const { firstName, lastName, email, password}: SignupPostBody = body;

    // Check if email is already in use
    const query = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    if(query.rows.length !== 0)
        return resError(201, "Account already registered with email");

    // Hash and salt password, create new user
    const hashed = await bcrypt.hash(password, 5);
    db.query("INSERT INTO users (id, first_name, last_name, email, password, privilege) VALUES ($1, $2, $3, $4, $5, $6)", [generateSnowflake(), firstName, lastName, email, hashed, Privilege.Unverified]);
    
    return res200();
};
