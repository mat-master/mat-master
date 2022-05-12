import type { APIGatewayEvent } from "aws-lambda";
import { query } from "../../../../util/db";
import { isResponse, res200, res500, Response } from "../../../../util/res";
import { getSchoolAuth } from "../../../../util/school";
import { authUser } from "../../../../util/user";

export const handler = async (event: APIGatewayEvent): Promise<Response> => {
    
    const user = await authUser(event);
    if(isResponse(user)) return user;

    const school = await getSchoolAuth(user, event);
    if(isResponse(school)) return school;

    const pin = generatePin("0123456789", 6);
    const res = await query("INSERT INTO kiosks (school, pin) VALUES ($1, $2) ON CONFLICT DO NOTHING", [school.id, pin]);
    if(!res) return res500();
    if(res.rowCount === 0) 
        return res200("Kiosk already exists");

    return res200();
}

const generatePin = (chars: string, length: number): string => [...Array(length)].map(
    (i)=>chars[Math.floor(Math.random()*chars.length)]
 ).join('');