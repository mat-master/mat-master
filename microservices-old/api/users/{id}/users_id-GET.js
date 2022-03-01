require("/opt/nodejs/env");
const { Client } = require('pg');
const auth = require('/opt/nodejs/auth');

// Gets user info.
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
  return {
    statusCode: 200,
    body: JSON.stringify({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      creationDate: user.creation_date 
    })
  };
};
