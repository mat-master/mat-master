import type { KioskLoginPostResponse } from "@common/types";
import { validator } from "@common/util";
import type { APIGatewayProxyEvent } from "aws-lambda";
import { query } from "../../../util/db";
import { isResponse, res200, res400, res500, Response } from "../../../util/res";
import { validateBody } from "../../../util/validation";
import * as jwt from 'jsonwebtoken'
import type { KioskPayload } from "../../../util/kiosk";

export const handler = async (event: APIGatewayProxyEvent): Promise<Response> => {
    const body = await validateBody(validator.api.kioskLoginPostSchema, event.body);
    if(isResponse(body)) return body;

    const res = await query("SELECT * FROM kiosks WHERE school=$1 AND pin=$2 LIMIT 1", [body.school, body.pin]);
    if(!res) return res500();
    if(res.rows.length === 0) return res400("School or pin is incorrect");

    const payload: KioskPayload = { school: body.school};

    return res200<KioskLoginPostResponse>({
        jwt: jwt.sign(payload, process.env.JWT_SECRET as string)
    });
}