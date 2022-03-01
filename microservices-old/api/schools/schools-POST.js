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
  if(!address.state)
    return {
      statusCode: 400,
      body: JSON.stringify({error: "Address missing state."})
    };
  if(!address.city)
    return {
      statusCode: 400,
      body: JSON.stringify({error: "Address missing city."})
    };
  if(!address.postalCode)
    return {
      statusCode: 400,
      body: JSON.stringify({error: "Address missing postal code."})
    };
  if(!address.line1)
    return {
      statusCode: 400,
      body: JSON.stringify({error: "Address missing line 1."})
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
  const account = await stripe.client.accounts.create({
    type: "standard",
    country: "US",
    business_type: "company",
    email: payload.email,
    company: {
      address: {
        country: "US",
        state: address.state,
        city: address.city,
        postal_code: address.postalCode,
        line1: address.line1,
        line2: address.line2
      }
    }
  })
  const addressId = await client.query("INSERT INTO addresses (id, state, city, postal_code, line_1, line_2) VALUES (DEFAULT, $1, $2, $3, $4, $5) RETURNING id", [address.state, address.city, address.postalCode, address.line1, address.line2]);
  const res = await client.query("INSERT INTO schools (id, name, owner, creation_date, tier, stripe_subscription_id, stripe_account_id, address) VALUES (DEFAULT, $1, $2, DEFAULT, 0, $3, $4, $5)", [name, payload.id, subscription.id, account.id, addressId.rows[0].id]);
  if(!res)
    return {
      statusCode: 500,
      body: JSON.stringify({error: "Could not create school due to an internal error."})
    };
  return {
    statusCode: 200
  };
};
