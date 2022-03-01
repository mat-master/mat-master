require("/opt/nodejs/env");
const { Client } = require('pg');
const stripe = require('/opt/nodejs/stripe');

exports.handler = async (req) => {
  const sig = req.headers['Stripe-Signature'];

  try {
    const event = JSON.parse(req.body);
    switch (event.type) {
      case 'invoice.paid':
        await invoicePaid(event.data.object);
        break;
      default:
        return {
          statusCode: 500,
          body: JSON.stringify({log: `Unhandled event: ${event}`})
        };
    }
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Could not verify webhook due to an internal error: "+err,
      })
    };
  }
  return {
    statusCode: 200
  };
};

async function invoicePaid(invoice) {
  const client = new Client();
  await client.connect();
  await client.query("UPDATE schools SET tier = 1 WHERE stripe_subscription_id = $1", [invoice.subscription]);
  await client.end();
} 