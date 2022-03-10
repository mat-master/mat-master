import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type { Privilege, School, User } from '@common/types';
import { res400, res200, isResponse, res403, Response, res500 } from '../../../../util/res';
import { authUser, getUser } from '../../../../util/user';
import { query } from '../../../../util/db';
import type { UserSchoolsGetResponse } from '@common/types';

export const handler = async (event: APIGatewayProxyEvent): Promise<Response> => {
    // Auth the requesting user with Bearer token
    const payload = await authUser(event);
    if(isResponse(payload))
    return payload;

    const adminSchools = await query("SELECT schools.id AS id, owner, name, address, tier, state, city, postal_code, line_1, line_2 FROM schools INNER JOIN addresses ON schools.address = addresses.id WHERE owner = $1", [payload.id]);
    if(!adminSchools)
    return res500();

    const studentSchools = await query("SELECT schools.id AS id, owner, name, address, tier, state, city, postal_code, line_1, line_2 FROM students INNER JOIN schools ON students.school = schools.id INNER JOIN addresses ON schools.address = addresses.id WHERE owner = $1", [payload.id]);
    if(!studentSchools)
        return res500();

    // Return the user
    return res200<UserSchoolsGetResponse>({
        adminSchools: adminSchools.rows.map(rowToSchool),
        studentSchools: studentSchools.rows.map(rowToSchool)
    });
}

const rowToSchool = (row: any): School => ({
    id: row.id,
    owner: row.owner,
    name: row.name,
    address: {
        state: row.state,
        city: row.city,
        postalCode: row.postal_code,
        line1: row.line_1,
        line2: row.line_2
    },
    tier: row.tier,
    stripeAccountId: "",
    stripeSubscriptionId: ""
});