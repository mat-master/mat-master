require("/opt/nodejs/env");
const { Client } = require('pg');
const auth = require('/opt/nodejs/auth');

// Gets school info.
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
  return {
    statusCode: 200,
    body: JSON.stringify({
      id: school.id,
      name: school.name,
      address: school.address,
    })
  };
};
