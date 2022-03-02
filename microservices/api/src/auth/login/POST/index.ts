import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as bcrypt from 'bcryptjs';
import validator from 'validator';
import * as jwt from 'jsonwebtoken';
import * as db from '../../../util/db';
import { res400, res200 } from '../../../util/res';

export interface LoginPostBody {
    email: string,
    password: string
}

// Logs in a user
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if(!event.body) 
        return res400("No body submitted");
    const body: LoginPostBody = JSON.parse(event.body);
    
    // Validate body
    const { email, password } = body;
    if(!validator.isEmail(email))
        return res400("Email is invalid");
    
    // Query for stored hashed password
    const query = await db.query("SELECT id, first_name, last_name, email, password, creation_date, privilege FROM users WHERE email=$1 LIMIT 1", [email]);
    if(query.rows.length === 0)
        return res400("Email or password is incorrect");

    // Compare password hashes
    const res = await bcrypt.compare(password, query.rows[0].password);
    if(!res)
        return res400("Email or password is incorrect");

    // Create JWT
    return res200({jwt: jwt.sign(query.rows[0], process.env.JWTPRIVATE as string)});
};
