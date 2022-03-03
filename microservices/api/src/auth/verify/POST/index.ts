import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { res200, res400, res401, res500 } from '../../../util/res';
import * as jwt from 'jsonwebtoken';
import { query } from '../../../util/db';
import { Privilege } from 'types';

export interface VerifyPostBody {
    token: string
}

// Verifies an email
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if(!event.body) 
        return res400("No body submitted");
    const body: VerifyPostBody = JSON.parse(event.body);

    const payload = await jwt.verify(body.token, process.env.JWTPRIVATE as jwt.Secret) as jwt.JwtPayload;
    if(!payload)
        return res401("Invalid authorization token");

    const res = await query(`UPDATE users SET privilege = ${Privilege.Verified} WHERE id = $1`, [payload.id]);
    if(!res)
        return res500("Error verifying user, please try again later");
    return res200(payload);
}