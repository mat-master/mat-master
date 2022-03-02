import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Privilege } from 'types/src/user';
import { res400, res200, isResponse, res403 } from '../../../util/res';
import { authUser, getUser } from '../../../util/user';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Check for id in path
  if(!event.pathParameters || !event.pathParameters.id)
    return res400("No id provided");

  // Auth the requesting user with Bearer token
  const payload = await authUser(event);
  if(isResponse(payload))
    return payload;

  // Check the id of the requested user
  const userId = event.pathParameters.id;
  if(userId !== "me" && payload.id !== BigInt(userId) && payload.privilege !== Privilege.Admin)
    return res403("You do not have permission to view this user");

  // Get the user
  const user = await getUser(userId === "me" ? payload.id : BigInt(userId));
  if(isResponse(user))
    return user;

  // Return the user
  return res200(user);
}