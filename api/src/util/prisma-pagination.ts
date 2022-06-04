import { z } from 'zod'

export const paginationParamsSchema = z.object({
	pagination: z
		.object({
			items: z.number().int().min(1).max(50),
			page: z.number().int().min(0),
		})
		.optional(),
})

export type PaginationParams = z.infer<typeof paginationParamsSchema>

export const prismaPagination = (pagination: PaginationParams['pagination']) => ({
	skip: pagination ? pagination.items * pagination.page : undefined,
	take: pagination ? pagination.items : undefined,
})
