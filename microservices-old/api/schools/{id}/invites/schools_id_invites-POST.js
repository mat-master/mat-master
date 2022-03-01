require("/opt/nodejs/env");
const { Client } = require('pg');
const validator = require('validator');
const auth = require('/opt/nodejs/auth');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

// Creates an invite.
// Requires Bearer token.
// email - Email of the invite.
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
  const { email } = body;
  if(!validator.isEmail(email))
    return {
        statusCode: 400,
        body: JSON.stringify({error: "Email is not valid."})
    };
  
  const client = new Client();
  await client.connect();
  const school = await auth.authSchool(event, payload, client);
  if(school.statusCode)
    return school;
  await client.query("INSERT INTO invites (school, email) VALUES ($1, $2) ON CONFLICT DO NOTHING", [school.id, email]);
  const user = await client.query("SELECT * FROM users WHERE email = $1", [email]);
  const schoolName = school.name;
  let message = "";
  if(user.rows.length === 0) {
    message = `You have been invited to join ${schoolName}.\n\nPlease click the following link to accept the invitation:\n\nhttps:/www.matmaster.app/signup?email=${email}&school=${school.id}`;
  } else {
    message = `You have been invited to join ${schoolName}.\n\nPlease click the following link to accept the invitation:\n\nhttps:/www.matmaster.app/join?school=${school.id}`;
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
