import { validator } from "@common/util";
import type { APIGatewayProxyEvent } from "aws-lambda";
import { query } from "../../../../util/db";
import { isResponse, res200, Response } from "../../../../util/res";
import { getSchoolAuth } from "../../../../util/school";
import { authUser } from "../../../../util/user";
import { validateBody } from "../../../../util/validation";

export const handler = async (event: APIGatewayProxyEvent): Promise<Response> => {
    const body = await validateBody(validator.api.schoolAttendancePostSchema, event.body);
    if(isResponse(body))
        return body;

    const user = await authUser(event);
    if(isResponse(user)) return user;

    const school = await getSchoolAuth(user, event);
    if(isResponse(school)) return school;

    const attendances = [];
    for(const clazz of body.classes!) {
        const attendance = await query(`INSERT INTO attendance (student, class, date, metadata) VALUES ($1, $2, DEFAULT, $3) RETURNING *`, [body.student, clazz, {type: "manual", user: user.id}]);
        if(attendance && attendance.rowCount > 0) attendances.push(attendance.rows[0]);
    }

    return res200();
}