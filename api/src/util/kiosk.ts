import type { Snowflake } from "@common/types";
import type { APIGatewayProxyEvent } from "aws-lambda";
import { res401, Response } from "./res";
import * as jwt from 'jsonwebtoken'

export interface KioskPayload {
    school: Snowflake
}

export const authKiosk = async (event: APIGatewayProxyEvent): Promise<KioskPayload | Response> => {
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
      school: payload.school
    };
  }