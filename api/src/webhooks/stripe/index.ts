import { Tier } from '@common/types';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type Stripe from 'stripe';
import { query } from '../../util/db';
import { res200, res400 } from '../../util/res';
import stripe from '../../util/stripe';



const webhookSecret = "whsec_40ef634365d4e661031ae03944927b85a0ed1df1af7524716f6d6dadf9347ba6";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const signature = event.headers['Stripe-Signature'];
    try {
        const stripeEvent = stripe.webhooks.constructEvent(
          event.body!,
          signature!,
          webhookSecret
        );
        if(stripeEvent.type === "invoice.paid") {
            const invoice: Stripe.Invoice = stripeEvent.data.object as Stripe.Invoice;
            await query("UPDATE schools SET tier = $1 WHERE stripe_subscription_id = $2", [Tier.BASIC, invoice.subscription]);
        }
        if(stripeEvent.type === "customer.subscription.updated") {
            const subscription: Stripe.Subscription = stripeEvent.data.object as Stripe.Subscription;
            
        }
        return res200(stripeEvent);
    } catch (err: any) {
        console.log({err: "Could not verify webhook signature", event: signature});
        return res400(JSON.stringify({err: "Could not verify webhook signature", event: signature}));
    }
}