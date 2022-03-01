require("/opt/nodejs/env");
const { Client } = require('pg');
const validator = require('validator');
const auth = require('/opt/nodejs/auth');

// Deletes an invite.
// Requires Bearer token.
// email - Email of the invite.
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
  const { email } = body;
  if(!validator.isEmail(email))
    return {
        statusCode: 400,
        body: JSON.stringify({error: "Email is not valid."})
    };
  
  const client = new Client();
  await client.connect();
  const school = await auth.authSchool(event, payload, client);
  if(school.statusCode)
    return school;
  const hasInvite = await client.query("SELECT * FROM invites WHERE school = $1 AND email = $2", [school.id, email]);
  if(hasInvite.rows.length === 0)
    return {
      statusCode: 404,
      body: JSON.stringify({error: `No invite is available for ${email}.`})
    };
  await client.query("DELETE FROM invites WHERE school = $1 AND email = $2", [school.id, email]);
  return {
    statusCode: 200
  };
};
