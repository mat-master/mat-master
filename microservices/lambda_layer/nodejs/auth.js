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