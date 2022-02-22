require("/opt/nodejs/env");
const { Client } = require('pg');
const auth = require('/opt/nodejs/auth');

// Gets all incoming invites.
// Requires Bearer token.
exports.handler = async (event) => {
  const payload = await auth.authBearer(event);
  if(payload.statusCode)
    return payload;
  const client = new Client();
  await client.connect();
  const user = await auth.getUser(event, payload, client);
  if(user.statusCode)
    return user;
  const invites = await client.query("SELECT schools.id, schools.name, schools.address FROM invites ON invites.school = schools.id INNER JOIN schools on WHERE owner = $1", [user.id]);
  if(!invites)
    return {
      statusCode: 500,
      body: JSON.stringify({error: "Could not get schools due to an internal error."})
    };
  return {
    statusCode: 200,
    body: JSON.stringify({
      invites: invites.rows
    })
  };
};
