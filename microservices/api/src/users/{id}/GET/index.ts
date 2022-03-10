import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type { Privilege, User } from '@common/types';
import { res400, res200, isResponse, res403, Response } from '../../../util/res';
import { authUser, getUser } from '../../../util/user';
import type { UserGetResponse } from '@common/types';

export const handler = async (event: APIGatewayProxyEvent): Promise<Response> => {
  // Auth the requesting user with Bearer token
  const payload = await authUser(event);
  if(isResponse(payload))
    return payload;

  // Get the user from url
  const user = await getUser(payload, event);
  if(isResponse(user))
    return user;

  // Return the user
  return res200<UserGetResponse>(user);
}