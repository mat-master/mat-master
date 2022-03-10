import type { Snowflake } from '@common/types';

export const snowflakeToBase64 = (id: Snowflake): string => {
    const buffer = Buffer.from(id.toString());
    return buffer.toString('base64');
}

export const snowflakeFromBase64 = (base64: string): Snowflake => {
    const buffer = Buffer.from(base64, 'base64');
    return BigInt(buffer.toString('ascii'));
}