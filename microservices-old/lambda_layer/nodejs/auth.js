const jwt = require('jsonwebtoken')

exports.authBearer = async (event) => {
  if(!event.headers["Authorization"])
    return {
      statusCode: 401,
      body: JSON.stringify({error: "No authorization header."})
    };
  const authHeader = event.headers["Authorization"];
  if(!authHeader.startsWith("Bearer "))
    return {
      statusCode: 401,
      body: JSON.stringify({error: "Invalid authorization header."})
    };
  const token = authHeader.substring(7);
  const payload = await jwt.verify(token, process.env.JWTPRIVATE);
  if(!payload)
    return {
      statusCode: 401,
      body: JSON.stringify({error: "Invalid JWT."})
    }
  return payload;
}

exports.authSchool = async (event, payload, client) => {
  const param = event.pathParameters.schoolId;
  if(!/^[0-9]+$/.test(param))
    return {
      statusCode: 400,
      body: JSON.stringify({error: "Invalid school id."})
    }
  const schoolId = parseInt(param);
  const schoolRes = await client.query("SELECT * FROM schools WHERE id = $1 AND owner = $2 LIMIT 1", [schoolId, payload.id]);
  if(schoolRes.rows.length === 0 && payload.privilege !== 2)
      return {
        statusCode: 401,
        body: JSON.stringify({error: "You are not allowed to edit this school."})
      }
  return schoolRes.rows[0];
}

exports.getUser = async (event, payload, client) => {
  const param = event.pathParameters.userId;
  let id;
  if(event.pathParameters.userId === "me")
    id = payload.id
  else {
    if(!/^[0-9]+$/.test(param))
      return {
        statusCode: 401,
        body: JSON.stringify({error: "Invalid user id."})
      }
    const userId = parseInt(param);
    if(userId === payload.id)
      return payload;
    if(payload.privilege !== 2)
      return {
        statusCode: 401,
        body: JSON.stringify({error: "Unauthenticated."})
      }
    id = userId;
  }
  const userRes = await client.query("SELECT id, first_name, last_name, email, creation_date, privilege, schools FROM users WHERE id = $1 LIMIT 1", [id]);
  if(userRes.rows.length === 0)
      return {
        statusCode: 404,
        body: JSON.stringify({error: "User not found."})
      }
  return userRes.rows[0];
}