require("/opt/nodejs/env");
const { Client } = require('pg');
const validator = require('validator');
const auth = require('/opt/nodejs/auth');

// Gets all current invites.
// Requires Bearer token.
exports.handler = async (event) => {
  const payload = await auth.authBearer(event);
  if(payload.statusCode)
    return payload;
  const client = new Client();
  await client.connect();
  const school = await auth.authSchool(event, payload, client);
  if(school.statusCode)
    return school;
  const invites = await client.query("SELECT * FROM invites WHERE school = $1", [school.id]);
  return {
    statusCode: 200,
    body: JSON.stringify({invites: invites.rows})
  };
};
