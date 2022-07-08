import { z } from 'zod'

export const snowflakeSchema = z.bigint()

export type Snowflake = z.infer<typeof snowflakeSchema>

export const SNOWFLAKE_EPOCH = Object.freeze(new Date(2022, 0, 1))
