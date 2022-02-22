require("/opt/nodejs/env");
const { Client } = require('pg');
const auth = require('/opt/nodejs/auth');

// Gets all involved schools.
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
  const ownedSchools = await client.query("SELECT schools.id, schools.name, schools.address FROM schools WHERE owner = $1", [user.id]);
  if(!ownedSchools)
    return {
      statusCode: 500,
      body: JSON.stringify({error: "Could not get schools due to an internal error."})
    };
  const studentSchools = await client.query("SELECT schools.id, schools.name, schools.address FROM students INNER JOIN schools ON students.school = schools.id WHERE user_id = $1", [user.id]);
  if(!studentSchools)
    return {
      statusCode: 500,
      body: JSON.stringify({error: "Could not get schools due to an internal error."})
    };
  return {
    statusCode: 200,
    body: JSON.stringify({
      studentSchools: studentSchools.rows,
      ownedSchools: ownedSchools.rows
    })
  };
};
