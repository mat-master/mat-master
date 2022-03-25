import { Privilege, School } from "@common/types"
import type { APIGatewayProxyEvent } from "aws-lambda"
import { query } from "./db";
import type { Payload } from "./payload";
import { isResponse, res400, res403, res404, Response } from "./res";

/**
 * Gets the school but makes sure the user has permission to view it.
 * @param userId the user requesting access to the school.
 * @param event the request event.
 * @returns the requested school.
 */
export const getSchoolAuth = async (payload: Payload, event: APIGatewayProxyEvent): Promise<School | Response> => {
    const school = await getSchool(event);
    if(isResponse(school))
        return school;
    if(school.owner !== payload.id && payload.privilege !== Privilege.Admin)
        return res403("You do not have permission to view this school");
    return school;
}

/**
 * Gets the school.
 * @param event  the request event.
 * @returns the requested school.
 */
export const getSchool = async (event: APIGatewayProxyEvent): Promise<School | Response> => {
    // Check for id in path
    if(!event.pathParameters || !event.pathParameters.id)
        return res400("No id provided");

    // Check the id of the requested user
    const schoolId = event.pathParameters.id;
    const school = await query('SELECT schools.id AS id, schools.owner AS owner, schools.name AS name, schools.tier AS tier, schools.stripe_account_id as stripe_account_id, schools.stripe_subscription_id as stripe_subscription_id, addresses.state as state, addresses.city as city, addresses.postal_code as postal_code, addresses.line_1 as line1, addresses.line_2 as line2 FROM schools INNER JOIN addresses on schools.address = addresses.id WHERE schools.id = $1 LIMIT 1', [schoolId]);
    if(school.rowCount === 0)
        return res404("School not found");

    const {id, owner, name, tier, stripe_account_id: stripeAccountId, stripe_subscription_id: stripeSubscriptionId, state, city, postal_code: postalCode, line1, line2} = school.rows[0];
    return {
        id,
        owner,
        name,
        address: {
            state,
            city,
            postalCode,
            line1,
            line2
        },
        tier,
        stripeAccountId,
        stripeSubscriptionId
    };
}
