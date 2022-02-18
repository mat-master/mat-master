require("/opt/nodejs/env");
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const validator = require('validator');

exports.handler = async (event) => {
    if(!event.body) {
        return {
          statusCode: 400,
          body: JSON.stringify({error: "No body submitted."})
        };
    }
    const { firstName, lastName, email, password } = event.body;
    if(!validator.isLength(firstName, {min:1, max:50}))
        return {
            statusCode: 400,
            body: JSON.stringify({error: "First name must be between 1-50 characters."})
        };
    if(!validator.isLength(lastName, {min:1, max:50}))
        return {
            statusCode: 400,
            body: JSON.stringify({error: "Last name must be between 1-50 characters."})
        };
    if(!validator.isEmail(email))
        return {
            statusCode: 400,
            body: JSON.stringify({error: "Email is not valid."})
        };
    if(!validator.isLength(password, {min:6, max:undefined}))
        return {
            statusCode: 400,
            body: JSON.stringify({error: "Password must be atleast 6 characters."})
        };
    const client = new Client();
    await client.connect();
    const query = await client.query("SELECT * FROM users WHERE email=$1", [email]);
    if(query.rows.length !== 0)
        return {
            statusCode: 400,
            body: JSON.stringify({error: "Account already registered with email."})
        };
    
    const hashed = await bcrypt.hash(password, 5);
    client.query("INSERT INTO users (id, first_name, last_name, email, password, privilege, creation_date) VALUES (DEFAULT, $1, $2, $3, $4, 0, DEFAULT)", [firstName, lastName, email, hashed]);
    const response = {
        statusCode: 200
    };
    return response;
};
