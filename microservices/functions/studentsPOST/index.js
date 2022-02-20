require("/opt/nodejs/env");
const { Client } = require('pg');
const validator = require('validator');
const auth = require('/opt/nodejs/auth');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

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
  const { school, firstName, lastName, email } = body;
  if(!validator.isLength(firstName, {min:1, max:50}))
    return {
        statusCode: 400,
        body: JSON.stringify({error: "First name must be between 1-50 characters."})
    };
  if(!validator.isLength(lastName, {min:1, max:50}))
    return {
        statusCode: 400,
        body: JSON.stringify({error: "Last name must be between 1-50 characters."})
    };
  if(!validator.isEmail(email))
    return {
        statusCode: 400,
        body: JSON.stringify({error: "Email is not valid."})
    };
  
  const client = new Client();
  await client.connect();
  const schoolRes = await client.query("SELECT * FROM schools WHERE id = $1 AND owner = $2 LIMIT 1", [school, payload.id]);
  if(schoolRes.rows.length === 0)
      return {
        statusCode: 401,
        body: JSON.stringify({error: "You are not allowed to edit this school."})
      }
  await client.query("INSERT INTO invitations (school, email) VALUES ($1, $2) ON CONFLICT DO NOTHING", [school, email]);
  const user = await client.query("SELECT * FROM users WHERE email = $1", [email]);
  const schoolName = schoolRes.rows[0].name;
  let message = "";
  if(user.rows.length === 0) {
    message = `Hello ${firstName} ${lastName},\n\nYou have been invited to join ${schoolName}.\n\nPlease click the following link to accept the invitation:\n\nhttps:/www.matmaster.app/signup?email=${email}&school=${school}&firstName=${firstName}&lastName=${lastName}`;
  } else {
    message = `Hello ${firstName} ${lastName},\n\nYou have been invited to join ${schoolName}.\n\nPlease click the following link to accept the invitation:\n\nhttps:/www.matmaster.app/join?school=${school}`;
  }
  const sesClient = new SESClient();
  await sesClient.send(new SendEmailCommand({
    Destination: {
      ToAddresses: [email]
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: message
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: `Invitation to join ${schoolName}`
      }
    },
    Source: "nate19522@gmail.com"
  }))
  return {
    statusCode: 200
  };
};
