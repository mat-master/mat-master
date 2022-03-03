import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Privilege } from 'types';
import { res400, res200, isResponse, res403 } from '../../../util/res';
import { authUser, getUser } from '../../../util/user';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Auth the requesting user with Bearer token
  const payload = await authUser(event);
  if(isResponse(payload))
    return payload;

  const user = await getUser(event, payload);
  if(isResponse(user))
    return user;

  // Return the user
  return res200(user);
}