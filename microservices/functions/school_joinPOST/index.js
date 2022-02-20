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
  const { school } = body;
  const client = new Client();
  await client.connect();
  const hasInvite = await client.query("SELECT * FROM invitations WHERE school = $1 AND email = $2 LIMIT 1", [school, payload.email]);
  if(hasInvite.rows.length === 0)
    return {
      statusCode: 400,
      body: JSON.stringify({error: `No invite is available for ${payload.email}.`})
    };
  await client.query("DELETE FROM invitations WHERE school = $1 AND email = $2", [school, payload.email]);
  const res = await client.query("INSERT INTO students (id, user_id, school) VALUES (DEFAULT, $1, $2)", [payload.id, school]);
  if(!res)
    return {
      statusCode: 500,
      body: JSON.stringify({error: "Could not join school due to an internal error."})
    };
  return {
    statusCode: 200
  };
};
