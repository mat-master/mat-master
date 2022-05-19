import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type { Class, Membership, Privilege, SchoolMembershipsGetResponse, Student, User } from '@common/types';
import { res400, res200, isResponse, res403, Response, res500 } from '../../../../util/res';
import { authUser, getUser } from '../../../../util/user';
import { query } from '../../../../util/db';
import { getSchoolAuth } from '../../../../util/school';
import type {  } from '@common/types';
import stripe from '../../../../util/stripe';

export const handler = async (event: APIGatewayProxyEvent): Promise<Response> => {
    const user = await authUser(event);
    if(isResponse(user))
        return user;

    const school = await getSchoolAuth(user, event);
    if(isResponse(school))
        return school;

    const memberships = await query(membershipQuery, [school.id]);
    if(!memberships)
        return res500();

    const responseMemberships: SchoolMembershipsGetResponse = await Promise.all(memberships.rows.map(async (membership): Promise<Membership> => {
        const price = await stripe.prices.retrieve(membership.stripe_price_id, {}, {stripeAccount: school.stripeAccountId});
        return {
            id: membership.id,
            name: membership.name,
            classes: membership.classes.map((clazz: any) => clazz.id),
            price: price.unit_amount!,
            interval: price.recurring!.interval,
            intervalCount: price.recurring!.interval_count,
        }
    }));

    //Return the memberships
    return res200<SchoolMembershipsGetResponse>(responseMemberships);
}

const membershipQuery = `SELECT memberships.id AS id, memberships.name AS name, stripe_price_id, json_agg(classes) AS classes
FROM memberships
INNER JOIN membership_classes
ON memberships.id = membership_classes.membership
INNER JOIN classes
ON membership_classes.class = classes.id
WHERE memberships.school = $1 
GROUP BY memberships.id;`;