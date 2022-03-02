import type { User } from 'types/src/user';
import * as db from './db';
import * as jwt from 'jsonwebtoken';
import type { APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { res401, res404 } from './res';
import type { Payload } from './payload';

/**
 * Get a user by id.
 * @param id id of the user to get
 */
export const getUser = async (id: bigint): Promise<User | APIGatewayProxyResult> => {
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

  const payload: jwt.JwtPayload = await jwt.verify(authToken, process.env.JWTPRIVATE as jwt.Secret) as jwt.JwtPayload;
  if(!payload)
    return res401("Invalid authorization token");

  return {
    id: payload.id,
    privilege: payload.privilege
  };
}