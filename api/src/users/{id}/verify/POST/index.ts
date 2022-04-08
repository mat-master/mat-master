import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { isResponse, res200 } from '../../../../util/res';
import { authUser, getUser } from '../../../../util/user';
import * as jwt from 'jsonwebtoken';

// Sends an email verification request to the requesting user's email
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Get requesting user
    const payload = await authUser(event);
    if(isResponse(payload))
        return payload;

    // Create Verify JWT that expires in 15 minutes
    const verifyToken = jwt.sign({"id": payload.id}, process.env.JWT_SECRET as string, {expiresIn: "15m"});
    return res200(verifyToken);
}