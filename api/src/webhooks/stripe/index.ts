import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { res200 } from '../../util/res';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    return res200();
}