import { validator } from "@common/util";
import type { APIGatewayEvent } from "aws-lambda";
import { query } from "../../../../util/db";
import { isResponse, res200, res404, res500, Response } from "../../../../util/res";
import { getSchoolAuth } from "../../../../util/school";
import { authUser } from "../../../../util/user";
import { validateBody } from "../../../../util/validation";

export const handler = async (event: APIGatewayEvent): Promise<Response> => {
    const body = await validateBody(validator.api.schoolKioskPatchSchema, event.body);
    if(isResponse(body))
        return body;

    const user = await authUser(event);
    if(isResponse(user)) return user;

    const school = await getSchoolAuth(user, event);
    if(isResponse(school)) return school;

    const res = await query("UPDATE kiosks SET pin = $2 WHERE school = $1", [school.id, body.pin]);
    if(!res) return res500();
    if(res.rowCount === 0) 
        return res404("Kiosk doesn't exist for this school");

    return res200();
}