require("/opt/nodejs/env");
const { Client } = require('pg');
const auth = require('/opt/nodejs/auth');

exports.handler = async (event) => {
  const payload = await auth.authBearer(event);
  if(payload.statusCode)
    return payload;
  const client = new Client();
  await client.connect();
  const res = await client.query("SELECT * FROM invitations WHERE email = $1", [payload.email]);
  if(!res)
    return {
      statusCode: 500,
      body: JSON.stringify({error: "Could not get invites due to an internal error."})
    };
  return {
    statusCode: 200,
    body: JSON.stringify({invites: res.rows})
  };
};
