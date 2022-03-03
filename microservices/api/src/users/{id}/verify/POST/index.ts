import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { isResponse, res200 } from '../../../../util/res';
import { authUser, getUser } from '../../../../util/user';
import * as jwt from 'jsonwebtoken';

// Sends an email verification request to the requesting user's email
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const payload = await authUser(event);
    if(isResponse(payload))
        return payload;

    const user = await getUser(event, payload);
    if(isResponse(user))
        return user;

    // Create Verify JWT that expires in 15 minutes
    const verifyToken = jwt.sign({"id": payload.id}, process.env.JWTPRIVATE as string, {expiresIn: "15m"});
    return res200();
}