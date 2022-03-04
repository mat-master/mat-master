import { Privilege, User } from '@common/types';
import * as db from './db';
import * as jwt from 'jsonwebtoken';
import type { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { res401, res404, res400, res403 } from './res';
import type { Payload } from './payload';

export const getUser = async (event: APIGatewayProxyEvent, payload: Payload): Promise<User | APIGatewayProxyResult> => {
  // Check for id in path
  if(!event.pathParameters || !event.pathParameters.id)
    return res400("No id provided");

    // Check the id of the requested user
  const userId = event.pathParameters.id;
  if(userId !== "me" && payload.id !== BigInt(userId) && payload.privilege !== Privilege.Admin)
    return res403("You do not have permission to view this user");

  // Get the user
  return await getUserId(userId === "me" ? payload.id : BigInt(userId));
}

/**
 * Get a user by id.
 * @param id id of the user to get
 */
export const getUserId = async (id: bigint): Promise<User | APIGatewayProxyResult> => {
  const user = await db.query('SELECT * FROM users WHERE id=$1 LIMIT 1', [id]);
  if (user.rows.length === 0)
    return res404('User not found');

  return {
    id: user.rows[0].id,
    firstName: user.rows[0].first_name,
    lastName: user.rows[0].last_name,
    email: user.rows[0].email,
    privilege: user.rows[0].privilege
  };
}

/**
 * Authenticates the users Authorization header and determines id.
 * @param event the lambda event
 * @returns a payload
 */
export const authUser = async (event: APIGatewayProxyEvent): Promise<Payload | APIGatewayProxyResult> => {
  if(!event.headers["Authorization"])
    return res401("No authorization header provided");
  const authHeader = event.headers["Authorization"];

  if(!authHeader.startsWith("Bearer "))
    return res401("Invalid authorization header");
  const authToken = authHeader.substring(7);

  const payload: jwt.JwtPayload = await jwt.verify(authToken, process.env.JWT_SECRET as jwt.Secret) as jwt.JwtPayload;
  if(!payload)
    return res401("Invalid authorization token");

  return {
    id: payload.id,
    email: payload.email,
    privilege: payload.privilege
  };
}