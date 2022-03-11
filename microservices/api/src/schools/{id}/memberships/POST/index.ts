import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { query } from '../../../../util/db';
import { isResponse, res200, res404, res500, Response } from '../../../../util/res';
import { getSchool, getSchoolAuth } from '../../../../util/school';
import { authUser, getUser, getUserId } from '../../../../util/user';
import { generateSnowflake } from '../../../../util/snowflake';
import { validator } from '@common/util';
import { validateBody } from '../../../../util/validation';
import stripe from '../../../../util/stripe';

export const handler = async (event: APIGatewayProxyEvent): Promise<Response> => {
    const body = await validateBody(validator.api.schoolMembershipsPostSchema, event.body);
    if(isResponse(body))
        return body;

    const user = await authUser(event);
    if(isResponse(user)) return user;

    const school = await getSchool(event);
    if(isResponse(school)) return school;

    const product = await stripe.products.create({
        name: `${body.name} Membership`,
    }, {
        stripeAccount: school.stripeAccountId
    });

    const price = await stripe.prices.create({
        product: product.id,
        currency: 'USD',
        unit_amount: body.price,
        recurring: {
            interval: body.interval,
            interval_count: body.intervalCount
        }
    }, {
        stripeAccount: school.stripeAccountId
    });

    const membershipId = generateSnowflake();
    const membership = await query("INSERT INTO memberships (id, school, name, stripe_price_id) VALUES ($1, $2, $3, $4) RETURNING *", [membershipId, school.id, body.name, price.id]);
    if(!membership) return res500();
    const classesValues = [];
    const classesStatement = [];
    let i = 1;
    for(const classId of body.classes!) {
        classesValues.push(membershipId, classId);
        classesStatement.push(`($${i++}, $${i++})`);
    }
    const classes = await query(`INSERT INTO membership_classes (membership, class) VALUES ${classesStatement.join(", ")}`, classesValues);
    if(!classes) return res500();

    return res200();
}