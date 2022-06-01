import { z } from 'zod'

export const schoolTierSchema = z.enum(['Trial', 'Basic', 'Premium'])

export type SchoolTier = z.infer<typeof schoolTierSchema>
