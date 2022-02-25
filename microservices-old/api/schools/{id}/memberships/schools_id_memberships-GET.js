require("/opt/nodejs/env");
const { Client } = require('pg');
const auth = require('/opt/nodejs/auth');

// Gets all current memberships.
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
  const memberships = await client.query("SELECT memberships.id, memberships.name, json_agg(json_build_object('id', classes.id, 'name', classes.name)) AS classes FROM memberships INNER JOIN membership_classes  ON memberships.id = membership_classes.membership INNER JOIN classes ON membership_classes.class = classes.id WHERE memberships.school = $1 GROUP BY memberships.id", [school.id]);
  return {
    statusCode: 200,
    body: JSON.stringify({memberships: memberships.rows})
  };
};
