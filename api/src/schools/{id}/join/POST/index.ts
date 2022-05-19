import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { query } from '../../../../util/db';
import { isResponse, res200, res402, res404, res500, Response } from '../../../../util/res';
import { getSchool, getSchoolAuth } from '../../../../util/school';
import { authUser, getUser, getUserId } from '../../../../util/user';
import { generateSnowflake } from '../../../../util/snowflake';
import stripe from '../../../../util/stripe';
import type { SchoolJoinPostResponse } from '@common/types';

export const handler = async (event: APIGatewayProxyEvent): Promise<Response> => {
    const user = await authUser(event);
    if(isResponse(user)) return user;

    const school = await getSchool(event);
    if(isResponse(school)) return school;

    const paymentMethods = await stripe.customers.listPaymentMethods(user.stripeCustomerId, {
        type: 'card'
    });
    if(paymentMethods.data.length === 0) {
        const intent = await stripe.setupIntents.create();
        if(!intent.client_secret)
            return res500();
        return res402<SchoolJoinPostResponse>(intent.client_secret)
    }

    const invites = await query("DELETE FROM invites WHERE school = $1 AND email = $2 RETURNING *", [school.id, user.email]);
    if(!invites) return res500();
    if(invites.rowCount === 0) return res404(`${school.name} has not invited you`);

    const token = await stripe.tokens.create({
        customer: user.stripeCustomerId,
    }, {
        stripeAccount: school.stripeAccountId
    });

    const userData = await getUserId(user.id);
    if(isResponse(userData)) return userData;

    const customer = await stripe.customers.create({
        name: `${userData.firstName} ${userData.lastName}`,
        email: userData.email,
        source: token.id,
    }, {
        stripeAccount: school.stripeAccountId
    });

    const student = await query("INSERT INTO students (id, school, \"user\", stripe_customer_id) VALUES ($1, $2, $3, $4) RETURNING *", [generateSnowflake(), school.id, user.id, customer.id]);
    if(!student) return res500();

    return res200<SchoolJoinPostResponse>();
}