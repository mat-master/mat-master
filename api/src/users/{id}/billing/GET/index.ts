import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type { Privilege, User, UserBillingGetResponse } from '@common/types';
import { res400, res200, isResponse, res403, Response } from '../../../../util/res';
import { authUser, getUser } from '../../../../util/user';
import type { UserGetResponse } from '@common/types';
import stripe from '../../../../util/stripe';
import type Stripe from 'stripe';

export const handler = async (event: APIGatewayProxyEvent): Promise<Response> => {
  // Auth the requesting user with Bearer token
  const payload = await authUser(event);
  if(isResponse(payload))
    return payload;

  // Get the user from url
  const user = await getUser(payload, event);
  if(isResponse(user))
    return user;

  const paymentMethods = await stripe.customers.listPaymentMethods(payload.stripeCustomerId, {type: 'card'});

  // Return the user
  return res200<UserBillingGetResponse>(paymentMethods.data.map((data: Stripe.PaymentMethod) => ({
    id: data.id,
    brand: data.card!.brand,
    expMonth: data.card!.exp_month,
    expYear: data.card!.exp_year,
    last4: data.card!.last4
  })));
}