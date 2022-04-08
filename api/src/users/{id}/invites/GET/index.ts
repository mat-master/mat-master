import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type { Privilege, User } from '@common/types';
import { res400, res200, isResponse, res403, Response, res500 } from '../../../../util/res';
import { authUser, getUser } from '../../../../util/user';
import { query } from '../../../../util/db';
import type { UserInvitesGetResponse } from '@common/types';

export const handler = async (event: APIGatewayProxyEvent): Promise<Response> => {
  // Auth the requesting user with Bearer token
  const payload = await authUser(event);
  if(isResponse(payload))
    return payload;

  const invites = await query("SELECT school FROM invites WHERE email = $1", [payload.email]);
  if(!invites)
    return res500();

  // Return the user
  return res200<UserInvitesGetResponse>(invites.rows.map(invite => invite.school));
}