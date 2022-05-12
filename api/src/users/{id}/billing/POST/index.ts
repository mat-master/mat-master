import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type { UserBillingPostResponse } from '@common/types';
import { res400, res200, isResponse, res403, Response, res500 } from '../../../../util/res';
import { authUser, getUser } from '../../../../util/user';
import type { UserGetResponse } from '@common/types';
import stripe from '../../../../util/stripe';
import type Stripe from 'stripe';

export const handler = async (event: APIGatewayProxyEvent): Promise<Response> => {
  // Auth the requesting user with Bearer token
  const payload = await authUser(event);
  if(isResponse(payload))
    return payload;

  const setupIntents = await stripe.setupIntents.create({
      customer: payload.stripeCustomerId
  });
  if(!setupIntents.client_secret)
    return res500();

  // Return the user
  return res200<UserBillingPostResponse>({
      stripeClientId: setupIntents.client_secret
  });
}