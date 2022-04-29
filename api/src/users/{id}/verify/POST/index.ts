import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { isResponse, res200 } from '../../../../util/res';
import { authUser, getUser } from '../../../../util/user';
import * as jwt from 'jsonwebtoken';
import { sendVerification } from '../../../../util/mail';

// Sends an email verification request to the requesting user's email
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Get requesting user
    const payload = await authUser(event);
    if(isResponse(payload))
        return payload;

    const user = await getUser(payload, event);
    if(isResponse(user))
        return user;

    await sendVerification(payload.id, user.email, user.firstName, user.lastName);
    return res200();
}