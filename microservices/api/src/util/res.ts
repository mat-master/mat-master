import type { APIGatewayProxyResult } from 'aws-lambda';

export type Response = APIGatewayProxyResult;

export const res200 = (body: any = null): Response => ({statusCode: 200, body: body ? JSON.stringify(body) : ""});

/* Generates a basic error response. */
export const resError = (statusCode: number, error: string): Response => {
    return {
        statusCode: statusCode,
        body: JSON.stringify({error: error})
    };
}

/** Response for bad data. */
export const res400 = (error: string): Response => resError(400, error);
/** Response for unauthorized. */
export const res401 = (error: string): Response => resError(401, error);
/** Response for unauthorized. */
export const res403 = (error: string): Response => resError(403, error);
/** Response for resource not found. */
export const res404 = (error: string): Response => resError(404, error);
/** Internal server error. */
export const res500 = (error: string): Response => resError(500, error);

export const isResponse = (res: any): res is Response => {
    return res.statusCode !== undefined && res.body !== undefined;
}

