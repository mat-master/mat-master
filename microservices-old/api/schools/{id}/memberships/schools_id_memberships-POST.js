require("/opt/nodejs/env");
const { Client } = require('pg');
const validator = require('validator');
const auth = require('/opt/nodejs/auth');
const stripe = require('/opt/nodejs/stripe');

// Adds a membership to the school.
// Requires Bearer token.
// name - Name of the membership
// classes - Array of class ids that membership includes.
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
  const { name, classes } = body;
  if(!validator.isLength(name, {min:5, max:100}))
      return {
          statusCode: 400,
          body: JSON.stringify({error: "Membership name must be atleast 5 characters."})
      };
  if(!Array.isArray(classes))
    return {
      statusCode: 400,
      body: JSON.stringify({error: "Classes must be an array."})
    };
  const client = new Client();
  await client.connect();
  const school = await auth.authSchool(event, payload, client);
  if(school.statusCode)
    return school;
  const classPreparedValues = [];
  for(let i = 1; i <= classes.length; i++)
    classPreparedValues.push(`$${i}`);
  const verifyClasses = await client.query(`SELECT school FROM classes WHERE id IN (${classPreparedValues.join(",")})`, [...classes]);
  if(verifyClasses.rowCount !== classes.length)
    return {
      statusCode: 400,
      body: JSON.stringify({error: "One or more classes do not exist."})
    };
  let classErr;
  verifyClasses.rows.forEach(row => {
    if(row.school !== school.id) {
      classErr = {
        statusCode: 400,
        body: JSON.stringify({error: "One or more classes do not belong to this school."})
      };
      return;
    }
  });
  if(classErr)
    return classErr;
  let res = await client.query("INSERT INTO memberships (id, school, name) VALUES (DEFAULT, $1, $2) RETURNING id", [school.id, name]);
  if(!res)
    return {
      statusCode: 500,
      body: JSON.stringify({error: "Could not create membership due to an internal error."})
    };
  const membershipId = res.rows[0].id;
  const preparedClasses = [];
  const preparedValues = [];
  let i = 1;
  classes.forEach(classId => {
    preparedClasses.push(membershipId, classId);
    preparedValues.push(`($${i++}, $${i++})`);
  });
  const preparedStatement = preparedValues.join(",");
  res = await client.query("INSERT INTO membership_classes (membership, class) VALUES "+preparedStatement, preparedClasses);
  if(!res)
    return {
      statusCode: 500,
      body: JSON.stringify({error: "Could not create membership due to an internal error."})
    };
  return {
    statusCode: 200
  };
};
