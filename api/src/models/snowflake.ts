import { z } from 'zod'

export const snowflakeSchema = z.bigint()

export type Snowflake = z.infer<typeof snowflakeSchema>
