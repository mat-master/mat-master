require("/opt/nodejs/env");
const { Client } = require('pg');
const auth = require('/opt/nodejs/auth');

exports.handler = async (event) => {
  const payload = await auth.authBearer(event);
  if(payload.statusCode)
    return payload;
  if(!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({error: "No body submitted."})
      };
  }
  const client = new Client();
  await client.connect();
  const res = await client.query("SELECT * FROM schools WHERE owner = $1", [payload.id]);
  if(!res)
    return {
      statusCode: 500,
      body: JSON.stringify({error: "Could not get schools due to an internal error."})
    };
  return {
    statusCode: 200,
    body: {schools: res.rows}
  };
};
