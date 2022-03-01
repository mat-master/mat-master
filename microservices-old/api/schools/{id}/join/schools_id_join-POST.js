require("/opt/nodejs/env");
const { Client } = require('pg');
const validator = require('validator');
const auth = require('/opt/nodejs/auth');

// Joins a school (Must be invited).
// Requires Bearer token.
exports.handler = async (event) => {
  const payload = await auth.authBearer(event);
  if(payload.statusCode)
    return payload;
  const param = event.pathParameters.schoolId;
  if(!/^[0-9]+$/.test(param))
    return {
      statusCode: 400,
      body: JSON.stringify({error: "Invalid school id."})
    }
  const schoolId = parseInt(param);
  const client = new Client();
  await client.connect();
  const hasInvite = await client.query("SELECT * FROM invites WHERE school = $1 AND email = $2 LIMIT 1", [schoolId, payload.email]);
  if(hasInvite.rows.length === 0)
    return {
      statusCode: 400,
      body: JSON.stringify({error: `No invite is available for ${payload.email}.`})
    };
  await client.query("DELETE FROM invites WHERE school = $1 AND email = $2", [schoolId, payload.email]);
  const res = await client.query("INSERT INTO students (id, user_id, school) VALUES (DEFAULT, $1, $2)", [payload.id, schoolId]);
  if(!res)
    return {
      statusCode: 500,
      body: JSON.stringify({error: "Could not join school due to an internal error."})
    };
  return {
    statusCode: 200
  };
};
