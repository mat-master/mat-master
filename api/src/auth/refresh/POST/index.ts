import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type { Privilege, RefreshPostResponse, User } from '@common/types';
import { res400, res200, isResponse, res403, Response, res404 } from '../../../util/res';
import { authUser, getUser } from '../../../util/user';
import type { UserGetResponse } from '@common/types';
import type { Payload } from '../../../util/payload';
import { query } from '../../../util/db';
import * as jwt from 'jsonwebtoken';

export const handler = async (event: APIGatewayProxyEvent): Promise<Response> => {
  // Auth the requesting user with Bearer token
  const payload = await authUser(event);
  if(isResponse(payload))
    return payload;

const user = await query('SELECT * FROM users WHERE id=$1 LIMIT 1', [payload.id]);
if (!user || user.rows.length === 0)
    return res404('User not found');

const newPayload: Payload = {
    id: user.rows[0].id,
    email: user.rows[0].email,
    privilege: user.rows[0].privilege,
    stripeCustomerId: user.rows[0].stripe_customer_id
};

  // Return the user
  return res200<RefreshPostResponse>({
    jwt: jwt.sign(newPayload, process.env.JWT_SECRET as string)
});
}