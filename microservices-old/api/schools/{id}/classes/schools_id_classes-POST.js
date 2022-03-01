require("/opt/nodejs/env");
const { Client } = require('pg');
const validator = require('validator');
const auth = require('/opt/nodejs/auth');

// Adds a class to the school.
// Requires Bearer token.
// name - Name of the class
// type - Scheduling type (onetime, recurring)
// scheduledDate? - Date of the class (onetime)
// scheduledDays? - Days of the week and time (recurring)
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
  const { name, type } = body;
  if(!validator.isLength(name, {min:5, max:100}))
      return {
          statusCode: 400,
          body: JSON.stringify({error: "School name must be atleast 5 characters."})
      };
  let schedule = {};
  let scheduleType;
  // A class that only occurs once such as a master seminar - 0 
  if(type === "onetime") {
    if(!body.scheduledDate)
      return {
        statusCode: 400,
        body: JSON.stringify({error: "Expected scheduledDate in body."})
      };
    schedule = { date: body.scheduledDate };
    scheduleType = 0;
  // A class that occurs on a regular schedule - 1
  } else if(type === "recurring") {
    if(!body.scheduledDays)
      return {
        statusCode: 400,
        body: JSON.stringify({error: "Expected scheduledDays in body."})
      };
    schedule = { days: body.scheduledDays };
    scheduleType = 1;
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify({error: `Unknown class type ${type}.`})
    };
  }
  const client = new Client();
  await client.connect();
  const school = await auth.authSchool(event, payload, client);
  if(school.statusCode)
    return school;
  const res = await client.query("INSERT INTO classes (id, name, school, schedule, \"scheduleType\") VALUES (DEFAULT, $1, $2, $3, $4)", [name, school.id, JSON.stringify(schedule), scheduleType]);
  if(!res)
    return {
      statusCode: 500,
      body: JSON.stringify({error: "Could not create class due to an internal error."})
    };
  return {
    statusCode: 200
  };
};
