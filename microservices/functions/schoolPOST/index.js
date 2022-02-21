require("/opt/nodejs/env");
const { Client } = require('pg');
const validator = require('validator');
const auth = require('/opt/nodejs/auth');

exports.handler = async (event) => {
  const payload = await auth.authBearer(event);
  if(payload.statusCode)
    return payload;
  const body = JSON.parse(event.body);
  if(!body) {
      return {
        statusCode: 400,
        body: JSON.stringify({error: "No body submitted."})
      };
  }
  const { name, address } = body;
  if(!validator.isLength(name, {min:5, max:100}))
      return {
          statusCode: 400,
          body: JSON.stringify({error: "School name must be atleast 5 characters."})
      };
  if(!validator.isLength(name, {min:10, max:150}))
    return {
        statusCode: 400,
        body: JSON.stringify({error: "Address must be atleast 10 characters."})
    };
  const client = new Client();
  await client.connect();
  const res = await client.query("INSERT INTO schools (id, name, owner, creation_date, tier, address) VALUES (DEFAULT, $1, $2, DEFAULT, 0, $3)", [name, payload.id, address]);
  if(!res)
    return {
      statusCode: 500,
      body: JSON.stringify({error: "Could not create school due to an internal error."})
    };
  return {
    statusCode: 200
  };
};
