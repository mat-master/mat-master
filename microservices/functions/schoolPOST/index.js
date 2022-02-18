require("/opt/nodejs/env");
const { Client } = require('pg');
const validator = require('validator');
const jwt = require('jsonwebtoken');

exports.handler = async (event) => {
  if(!event.headers["Authorization"])
    return {
      statusCode: 401,
      body: JSON.stringify({error: "No authorization header."})
    };
  const authHeader = event.headers["Authorization"];
  if(!authHeader.startsWith("Bearer "))
    return {
      statusCode: 401,
      body: JSON.stringify({error: "Invalid authorization header."})
    };
  const token = authHeader.substring(7);
  const payload = await jwt.verify(token, process.env.JWTPRIVATE);
  if(!payload)
    return {
      statusCode: 401,
      body: JSON.stringify({error: "Invalid JWT."})
    }
  if(!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({error: "No body submitted."})
      };
  }
  const { name } = event.body;
  if(!validator.isLength(name, {min:5, max:100}))
      return {
          statusCode: 400,
          body: JSON.stringify({error: "School name must be atleast 5 characters."})
      };
  const client = new Client();
  await client.connect();
  const res = await client.query("INSERT INTO schools (id, name, owner, creation_date) VALUES (DEFAULT, $1, $2, DEFAULT)", [name, payload.id]);
  if(!res)
    return {
      statusCode: 500,
      body: JSON.stringify({error: "Could not create school."})
    };
  return {
    statusCode: 200
  };
};
