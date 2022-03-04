import type { School } from "@common/types"
import type { APIGatewayProxyEvent } from "aws-lambda"
import { query } from "./db";
import { isResponse, res400, res403, res404, Response } from "./res";

/**
 * Gets the school but makes sure the user has permission to view it.
 * @param userId the user requesting access to the school.
 * @param event the request event.
 * @returns the requested school.
 */
export const getSchoolAuth = async (userId: bigint, event: APIGatewayProxyEvent): Promise<School | Response> => {
    const school = await getSchool(event);
    if(isResponse(school))
        return school;
    if(school.owner !== userId)
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
    const school = await query('SELECT * FROM schools WHERE id=$1 LIMIT 1', [schoolId]);
    if(school.rowCount === 0)
        return res404("School not found");

    return school.rows[0];
}
