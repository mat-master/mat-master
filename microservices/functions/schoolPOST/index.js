require("/opt/nodejs/env");
const { Client } = require('pg');
const validator = require('validator');
const auth = require('/opt/nodejs/auth');

exports.handler = async (event) => {
  const payload = await auth.authBearer(event);
  if(payload.statusCode)
    return payload;
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
  const res = await client.query("INSERT INTO schools (id, name, owner, creation_date, tier) VALUES (DEFAULT, $1, $2, DEFAULT, 0)", [name, payload.id]);
  if(!res)
    return {
      statusCode: 500,
      body: JSON.stringify({error: "Could not create school due to internal error."})
    };
  return {
    statusCode: 200
  };
};
