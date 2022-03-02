import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as bcrypt from 'bcryptjs';
import validator from 'validator';
import * as db from '../../../util/db';
import { res200, res400, resError } from '../../../util/res';

export interface SignupPostBody {
    firstName: string,
    lastName: string,
    email: string,
    password: string
}

// Signs up a user
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    if(!event.body) 
        return res400("No body submitted");
    const { firstName, lastName, email, password}: SignupPostBody = JSON.parse(event.body);

    // Validate body fields
    if(!validator.isLength(firstName, {min:1, max:50}))
        return res400("First name must be between 1-50 characters");
    if(!validator.isLength(lastName, {min:1, max:50}))
        return res400("Last name must be between 1-50 characters");
    if(!validator.isEmail(email))
        return res400("Email is invalid");
    if(!validator.isLength(password, {min:6, max:undefined}))
        return res400("Password must be atleast 6 characters");

    // Check if email is already in use
    const query = await db.query("SELECT * FROM users WHERE email=$1", [email]);
    if(query.rows.length !== 0)
        return resError(201, "Account already registered with email");

    // Hash and salt password, create new user
    const hashed = await bcrypt.hash(password, 5);
    db.query("INSERT INTO users (id, first_name, last_name, email, password, privilege, creation_date) VALUES (DEFAULT, $1, $2, $3, $4, 0, DEFAULT)", [firstName, lastName, email, hashed]);
    
    return res200();
};
