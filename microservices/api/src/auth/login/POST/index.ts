import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as bcrypt from 'bcryptjs';
import v from 'validator';
import * as jwt from 'jsonwebtoken';
import * as db from '../../../util/db';
import { res400, res200, isResponse, Response } from '../../../util/res';
import type { Payload } from '../../../util/payload';
import { validator } from '@common/util';
import type { InferType } from 'yup';
import { validateBody } from '../../../util/validation';

export type LoginPostBody = InferType<typeof validator.loginSchema>;

export interface LoginPostResponse {
    jwt: string;
}

// Logs in a user
export const handler = async (event: APIGatewayProxyEvent): Promise<Response> => {
    const body: LoginPostBody | Response = await validateBody(validator.loginSchema, event.body);
    if(isResponse(body))
        return body;
    
    // Query for stored hashed password
    const query = await db.query("SELECT * FROM users WHERE email=$1 LIMIT 1", [body.email]);
    if(query.rows.length === 0)
        return res400("Email or password is incorrect");
    const user = query.rows[0];

    // Compare password hashes
    const res = await bcrypt.compare(body.password, user.password);
    if(!res)
        return res400("Email or password is incorrect");

    const payload: Payload = {
        id: user.id,
        email: user.email,
        privilege: user.privilege,
        stripeCustomerId: user.stripe_customer_id
    };

    // Create JWT
    return res200<LoginPostResponse>({
        jwt: jwt.sign(payload, process.env.JWT_SECRET as string)
    });
};
