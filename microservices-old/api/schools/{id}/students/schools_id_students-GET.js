require("/opt/nodejs/env");
const { Client } = require('pg');
const auth = require('/opt/nodejs/auth');

// Gets all current students.
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
  const students = await client.query("SELECT students.id, users.first_name, users.last_name FROM students INNER JOIN users ON students.user_id = users.id WHERE school = $1", [school.id]);
  return {
    statusCode: 200,
    body: JSON.stringify({students: students.rows})
  };
};
