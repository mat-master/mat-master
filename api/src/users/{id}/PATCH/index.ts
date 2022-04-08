import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as bcrypt from 'bcryptjs';
import * as db from '../../../util/db';
import { generateSnowflake, getLambdaIp } from '../../../util/snowflake';
import { isResponse, res200, res400, res500, resError } from '../../../util/res';
import { Privilege, UserPatchBody } from '@common/types';
import type { SignupPostBody } from '@common/types';
import { validator } from '@common/util';
import { validateBody } from '../../../util/validation';
import { authUser } from '../../../util/user';
import imageDataUri from 'image-data-uri';
import * as webp from 'webp-converter';
import aws from '@aws-sdk/client-ses'

// Signs up a user
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const body = await validateBody(validator.api.userPatchSchema, event.body);
    if(isResponse(body)) return body;

    const payload = await authUser(event);
    if(isResponse(payload))
        return payload;

    let i = 2;
    const statements = [];
    const values = [];

    if(body.firstName) {
        statements.push(`first_name = $${i++}`);
        values.push(body.firstName);
    }
    if(body.lastName) {
        statements.push(`last_name = $${i++}`);
        values.push(body.lastName);
    }
    if(body.avatar) {
        const avatar = imageDataUri.decode(body.avatar);
        const imageType = avatar.imageType.split("/")[1];
        webp.buffer2webpbuffer(avatar.data, imageType, "-q 80")
        .then((buffer: Buffer) => {

        });
    }

    //TODO: Add avatar creation in s3 bucket from data_uri and update avatar_url to reflect that

    const query = await db.query(`UPDATE users SET ${statements.join(",")} WHERE id = $1`, [payload.id, ...values]);
    if(!query)
        return res500();

    return res200();
};
