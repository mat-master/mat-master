require("/opt/nodejs/env");
const { Client } = require('pg');
const validator = require('validator');
const auth = require('/opt/nodejs/auth');
const stripe = require('/opt/nodejs/stripe');

// Creates a new school.
// Requires Bearer token.
// name - Name of the school.
// address - Address of the school.
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
  const { name, address } = body;
  if(!validator.isLength(name, {min:5, max:100}))
      return {
          statusCode: 400,
          body: JSON.stringify({error: "School name must be atleast 5 characters."})
      };
  if(!validator.isLength(name, {min:10, max:150}))
    return {
        statusCode: 400,
        body: JSON.stringify({error: "Address must be atleast 10 characters."})
    };
  const client = new Client();
  await client.connect();
  const customer = await stripe.getCustomer(payload, client);
  if(customer.statusCode)
    return customer;
  const subscription = await stripe.client.subscriptions.create({
    customer: customer.id,
    items: [{
      price: "price_1KW88vGsHxGKM7KBG946ldmZ",
    }],
    payment_behavior: "default_incomplete",
    expand: ["latest_invoice.payment_intent"],
    trial_period_days: 14
  });
  const res = await client.query("INSERT INTO schools (id, name, owner, creation_date, tier, address, stripe_subscription_id) VALUES (DEFAULT, $1, $2, DEFAULT, 0, $3, $4)", [name, payload.id, address, subscription.id]);
  if(!res)
    return {
      statusCode: 500,
      body: JSON.stringify({error: "Could not create school due to an internal error."})
    };
  return {
    statusCode: 200
  };
};
