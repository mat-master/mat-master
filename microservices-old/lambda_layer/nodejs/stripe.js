const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.getCustomer = async (payload, client) => {
  const res = await client.query("SELECT stripe_customer_id FROM users WHERE id = $1 LIMIT 1", [payload.id]);
  if(res.rows.length === 0)
    return {
      statusCode: 404,
      body: JSON.stringify({error: "User not found."})
    }
  if(res.rows[0].stripe_customer_id)
    return stripe.customers.retrieve(res.rows[0].stripe_customer_id);
  const customer = await stripe.customers.create({
    email: payload.email,
    firstName: payload.first_name,
    lastName: payload.last_name
  });
  await client.query("UPDATE users SET stripe_customer_id = $1 WHERE id = $2", [customer.id, payload.id]);
  return customer;
}
exports.client = stripe;