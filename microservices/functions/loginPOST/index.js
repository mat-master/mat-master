require("/opt/nodejs/env");
const { Client } = require('pg');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
    const body = JSON.parse(event.body);
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
    const query = await client.query("SELECT * FROM users WHERE email=$1 LIMIT 1", [email]);
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
    const response = {
        statusCode: 200,
        body: JSON.stringify({jwt: jwt.sign(query.rows[0], process.env.JWTPRIVATE)})
    };
    return response;
};
