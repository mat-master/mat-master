import { z } from 'zod'

export const privilegeSchema = z.enum(['Unverified', 'Verified', 'Admin'])

export type Privilege = z.infer<typeof privilegeSchema>
