require("/opt/nodejs/env");
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Client } from 'pg';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';

export interface LoginPostBody {
    email: string,
    password: string
  }

// Logs in a user.
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const body: LoginPostBody = JSON.parse(event.body);
    if(!body) {
        return {
          statusCode: 400,
          body: JSON.stringify({error: "No body submitted."})
        };
    }
    const { email, password } = body;
    if(!validator.isEmail(email))
        return {
            statusCode: 400,
            body: JSON.stringify({error: "Email is not valid."})
        };
    const client = new Client();
    await client.connect();
    const query = await client.query("SELECT id, first_name, last_name, email, password, creation_date, privilege FROM users WHERE email=$1 LIMIT 1", [email]);
    if(query.rows.length === 0)
        return {
            statusCode: 400,
            body: JSON.stringify({error: "Email or password is incorrect."})
        };
    const res = await bcrypt.compare(password, query.rows[0].password);
    if(!res)
      return {
        statusCode: 400,
        body: JSON.stringify({error: "Email or password is incorrect."})
    }
    return {
        statusCode: 200,
        body: JSON.stringify({jwt: jwt.sign(query.rows[0], process.env.JWTPRIVATE)})
    };
};
