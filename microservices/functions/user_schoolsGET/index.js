require("/opt/nodejs/env");
const { Client } = require('pg');
const auth = require('/opt/nodejs/auth');

exports.handler = async (event) => {
  const payload = await auth.authBearer(event);
  if(payload.statusCode)
    return payload;
  const client = new Client();
  await client.connect();
  const ownedSchools = await client.query("SELECT id FROM schools WHERE owner = $1", [payload.id]);
  if(!ownedSchools)
    return {
      statusCode: 500,
      body: JSON.stringify({error: "Could not get schools due to an internal error."})
    };
  const studentSchools = await client.query("SELECT school FROM students WHERE user_id = $1", [payload.id]);
  if(!studentSchools)
    return {
      statusCode: 500,
      body: JSON.stringify({error: "Could not get schools due to an internal error."})
    };
  return {
    statusCode: 200,
    body: JSON.stringify({schools: [...ownedSchools.rows, ...studentSchools.rows]})
  };
};
