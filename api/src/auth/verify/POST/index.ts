import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { isResponse, res200, res400, res401, res500 } from '../../../util/res';
import * as jwt from 'jsonwebtoken';
import { query } from '../../../util/db';
import { Privilege, VerifyPostResponse } from '@common/types';
import stripe from '../../../util/stripe';
import { getUserId } from '../../../util/user';
import { validator } from '@common/util';
import { validateBody } from '../../../util/validation';
import type { Payload } from '../../../util/payload';

// Verifies an email
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const body = await validateBody(validator.api.verifyPostSchema,  event.body);
    if(isResponse(body))
        return body;

    // Verify verification token
    let payload: jwt.JwtPayload;
    try {
        payload = await jwt.verify(body.token, process.env.JWT_SECRET as jwt.Secret) as jwt.JwtPayload;
    } catch(err: any) {
        if(err instanceof jwt.TokenExpiredError) {
            if(err.name === "TokenExpiredError")
                return res400("Verification token expired");
            return res400("Invalid verification token");
        }
        return res500("Internal server error trying to verify token, please try again later");
    }

    // Get user by the payload's id
    const user = await getUserId(payload.id);
    if(isResponse(user))
        return res400("Invalid verification token, please try requesting a new verification email");

    if(user.privilege === Privilege.Verified)
        return res200("User already verified");

    // Since user is now verified, we can create a stripe customer for them
    const customer = await stripe.customers.create({
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        metadata: {
            id: user.id.toString()
        }
    });
    
    // Set user to verified in database, must set stripe customer id first because it can't be null when verified
    const res = await query("UPDATE users SET stripe_customer_id = $1, privilege = $2 WHERE id = $3", [customer.id, Privilege.Verified, payload.id]);
    if(!res)
        return res500("Error verifying user, please try again later");
    const newPayload: Payload = {
        id: user.id,
        email: user.email,
        privilege: Privilege.Verified,
        stripeCustomerId: customer.id
    };

    // Create JWT
    return res200<VerifyPostResponse>({
        jwt: jwt.sign(payload, process.env.JWT_SECRET as string)
    });
}