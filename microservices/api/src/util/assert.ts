
import type { APIGatewayProxyResult } from 'aws-lambda';

export const res200 = (body: any): APIGatewayProxyResult => ({statusCode: 200, body: JSON.stringify(body)});

/* Generates a basic error response. */
export const resError = (statusCode: number, error: string): APIGatewayProxyResult => {
    return {
        statusCode: statusCode,
        body: JSON.stringify({error: error})
    };
}

/* Response for bad data. */
export const res400 = (error: string) => resError(400, error);
/* Response for unauthorized. */
export const res403 = (error: string) => resError(403, error);
/* Response for resource not found. */
export const res404 = (error: string) => resError(404, error);